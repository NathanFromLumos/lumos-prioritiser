import { NextResponse } from "next/server";
import { Resend } from "resend";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import fs from "node:fs";
import path from "node:path";

import type { ChannelScores } from "../../../lib/types";
import { generatePriorities } from "../../../lib/priorities";

// Make sure this route runs on the Node.js runtime (not edge)
export const runtime = "nodejs";

type Body = {
  name: string;
  company?: string;
  email: string;
  phone?: string;
  scores: ChannelScores;
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Body;
    const { name, company, email, phone, scores } = body;

    console.log("🛰️ /api/send-report body:", body);

    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error("Missing RESEND_API_KEY env var");
      return NextResponse.json(
        { error: "Server not configured for email (no RESEND_API_KEY)" },
        { status: 500 }
      );
    }

    const target = process.env.REPORT_TARGET_EMAIL;
    if (!target) {
      console.error("Missing REPORT_TARGET_EMAIL env var");
      return NextResponse.json(
        { error: "Server not configured for email (no REPORT_TARGET_EMAIL)" },
        { status: 500 }
      );
    }

    const resend = new Resend(apiKey);
    const priorities = generatePriorities(scores);

    const pdfBuffer = await createReportPdf({
      name,
      company,
      email,
      phone,
      scores,
      priorities,
    });

    const textSummary = buildTextSummary({
      name,
      company,
      email,
      phone,
      scores,
      priorities,
    });

    const sendResult = await resend.emails.send({
      from: "Lumos Prioritiser <onboarding@resend.dev>", // swap once domain verified
      to: target,
      subject: `New Lumos Prioritiser report – ${company || name}`,
      text: textSummary,
      attachments: [
        {
          filename: "lumos-prioritiser-report.pdf",
          content: pdfBuffer.toString("base64"),
          contentType: "application/pdf",
        },
      ],
    });

    console.log("📨 Resend send result:", sendResult);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Error in send-report:", err);
    return NextResponse.json(
      { error: "Failed to send report" },
      { status: 500 }
    );
  }
}

// ---------- helpers ----------

type ReportContext = {
  name: string;
  company?: string;
  email: string;
  phone?: string;
  scores: ChannelScores;
  priorities: ReturnType<typeof generatePriorities>;
};

function buildTextSummary(ctx: ReportContext): string {
  const { name, company, email, phone, scores, priorities } = ctx;

  const lines: string[] = [];

  lines.push("New Lumos Prioritiser report");
  lines.push("");
  lines.push(`Name: ${name}`);
  if (company) lines.push(`Company: ${company}`);
  lines.push(`Email: ${email}`);
  if (phone) lines.push(`Phone: ${phone}`);
  lines.push("");
  lines.push("Channel scores:");
  lines.push(`- Foundations: ${scores.foundations}%`);
  lines.push(`- Website: ${scores.website}%`);
  lines.push(`- SEO: ${scores.seo}%`);
  lines.push(`- Email: ${scores.email}%`);
  lines.push(`- PPC: ${scores.ppc}%`);
  lines.push(`- Social: ${scores.social}%`);
  lines.push("");
  lines.push("Top priorities:");
  priorities.forEach((p, index) => {
    lines.push(`${index + 1}. [${p.channel}] ${p.title}`);
  });

  return lines.join("\n");
}

async function createReportPdf(ctx: ReportContext): Promise<Buffer> {
  const { name, company, email, phone, scores, priorities } = ctx;

  const pdfDoc = await PDFDocument.create();

  // ---- Brand tokens ----
  const charcoal = rgb(0x2b / 255, 0x2f / 255, 0x33 / 255);
  const blue = rgb(0x38 / 255, 0x4c / 255, 0x55 / 255);
  const grey = rgb(0x93 / 255, 0x9d / 255, 0x9c / 255);
  const white = rgb(1, 1, 1);

  const CM_TO_PT = 28.3465;
  const footerHeight = 3.7 * CM_TO_PT; // footer ~3.7cm tall, content height ~26cm

  const marginX = 56;

  // ---- Fonts (branded if available) ----
  let headingFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  let bodyFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

  try {
    const spaceGroteskPath = path.join(
      process.cwd(),
      "public",
      "fonts",
      "SpaceGrotesk-SemiBold.ttf"
    );
    if (fs.existsSync(spaceGroteskPath)) {
      const bytes = fs.readFileSync(spaceGroteskPath);
      headingFont = await pdfDoc.embedFont(bytes);
    }
  } catch {
    console.warn("Space Grotesk not found, falling back to HelveticaBold");
  }

  try {
    const interPath = path.join(
      process.cwd(),
      "public",
      "fonts",
      "Inter-Regular.ttf"
    );
    if (fs.existsSync(interPath)) {
      const bytes = fs.readFileSync(interPath);
      bodyFont = await pdfDoc.embedFont(bytes);
    }
  } catch {
    console.warn("Inter not found, falling back to Helvetica");
  }

  // ---- Logo (optional) ----
  let logoImage: any | null = null;
  let logoDims: { width: number; height: number } | null = null;

  try {
    const logoPath = path.join(process.cwd(), "public", "lumos-logo-dark.png");
    if (fs.existsSync(logoPath)) {
      const logoBytes = fs.readFileSync(logoPath);
      logoImage = await pdfDoc.embedPng(logoBytes);
      logoDims = logoImage.scale(0.4);
    }
  } catch {
    console.warn("Logo not found, skipping");
  }

  // Helper to add a fully framed page (background, header, footer)
  function addFramedPage(headerLabel?: string) {
    const page = pdfDoc.addPage();
    const { width, height } = page.getSize();

    // Background
    page.drawRectangle({
      x: 0,
      y: 0,
      width,
      height,
      color: charcoal,
    });

    // Header band
    const headerHeight = 72;
    page.drawRectangle({
      x: 0,
      y: height - headerHeight,
      width,
      height: headerHeight,
      color: blue,
    });

    if (logoImage && logoDims) {
      page.drawImage(logoImage, {
        x: marginX,
        y: height - headerHeight + (headerHeight - logoDims.height) / 2,
        width: logoDims.width,
        height: logoDims.height,
      });
    } else {
      page.drawText("LUMOS", {
        x: marginX,
        y: height - headerHeight + 26,
        size: 22,
        font: headingFont,
        color: white,
      });
    }

    page.drawText("Marketing team in a box, now in app form.", {
      x: marginX,
      y: height - headerHeight + 18,
      size: 10,
      font: bodyFont,
      color: grey,
    });

    // Optional page label on the right
    if (headerLabel) {
      page.drawText(headerLabel.toUpperCase(), {
        x: width - marginX - 180,
        y: height - headerHeight + 24,
        size: 10,
        font: headingFont,
        color: white,
      });
    }

    // Footer
    const footerY = footerHeight - 26;
    page.drawLine({
      start: { x: marginX, y: footerY + 10 },
      end: { x: width - marginX, y: footerY + 10 },
      thickness: 0.5,
      color: grey,
    });

    page.drawText(
      "Generated by the Lumos Prioritiser — a free tool from Lumos Digital Marketing.",
      {
        x: marginX,
        y: footerY,
        size: 9,
        font: bodyFont,
        color: grey,
      }
    );

    const contentTop = height - headerHeight - 40;
    const contentBottom = footerHeight + 40;

    return { page, width, height, contentTop, contentBottom };
  }

  // --- Page 1: Title / cover ---
  {
    const { page, width, height } = addFramedPage("Report overview");

    const title = "Lumos Prioritiser Report";
    const subtitle = company
      ? `For ${company}`
      : `For ${name}`;
    const small = "A quick, honest snapshot of where your marketing is now — and what to do next.";

    const titleSize = 28;
    const subtitleSize = 16;
    const smallSize = 11;

    const titleWidth = headingFont.widthOfTextAtSize(title, titleSize);
    const subtitleWidth = bodyFont.widthOfTextAtSize(subtitle, subtitleSize);
    const smallWidth = bodyFont.widthOfTextAtSize(small, smallSize);

    const centerX = width / 2;

    page.drawText(title, {
      x: centerX - titleWidth / 2,
      y: height / 2 + 40,
      size: titleSize,
      font: headingFont,
      color: white,
    });

    page.drawText(subtitle, {
      x: centerX - subtitleWidth / 2,
      y: height / 2 + 8,
      size: subtitleSize,
      font: bodyFont,
      color: white,
    });

    page.drawText(small, {
      x: centerX - smallWidth / 2,
      y: height / 2 - 22,
      size: smallSize,
      font: bodyFont,
      color: grey,
    });

    const metaLines = [
      `Name: ${name}`,
      company ? `Company: ${company}` : undefined,
      `Email: ${email}`,
      phone ? `Phone: ${phone}` : undefined,
    ].filter(Boolean) as string[];

    let metaY = height / 2 - 70;
    metaLines.forEach((line) => {
      page.drawText(line, {
        x: marginX,
        y: metaY,
        size: 10,
        font: bodyFont,
        color: grey,
      });
      metaY -= 14;
    });
  }

  // --- Page 2: Context / How to read this ---
  {
    const { page, contentTop, contentBottom } = addFramedPage(
      "How to read this report"
    );

    const headingSize = 18;
    const bodySize = 11;
    const lineHeight = bodySize * 1.5;

    let y = contentTop;

    const drawHeading = (text: string) => {
      page.drawText(text, {
        x: marginX,
        y,
        size: headingSize,
        font: headingFont,
        color: white,
      });
      y -= headingSize * 1.6;
    };

    const drawParagraph = (text: string) => {
      const lines = wrapText(text, 92);
      const needed = lines.length * lineHeight;
      if (y - needed < contentBottom) return;

      for (const line of lines) {
        page.drawText(line, {
          x: marginX,
          y,
          size: bodySize,
          font: bodyFont,
          color: rgb(0.92, 0.96, 0.97),
        });
        y -= lineHeight;
      }
      y -= 6;
    };

    drawHeading("What this report tells you");

    drawParagraph(
      "The Lumos Prioritiser is a short assessment designed to turn a few honest answers into a clear next-step plan. It is not a full audit, but it gives a directional view of where your marketing is strong and where there may be more risk or opportunity."
    );

    drawParagraph(
      "We score six core areas — Foundations, Website, SEO, Email, PPC and Social. Higher scores mean stronger, more reliable performance. Lower scores highlight places where fixing a few basics could unlock outsized gains."
    );

    drawHeading("How to use your results");

    drawParagraph(
      "Use this report as a conversation starter, not a final verdict. Start with the Channel snapshot to see where your scores cluster. Then focus on the Recommended next moves — these are the practical actions most likely to unlock meaningful progress in the next 4–8 weeks."
    );

    drawParagraph(
      "You do not need to tackle everything at once. Pick one or two priorities, commit to them, and review the impact. When you are ready, we can support you with a deeper audit and an execution plan."
    );
  }

  // --- Page 3+: Detailed priority cards ---
  {
    const headingSize = 16;
    const bodySize = 11;
    const headingLine = headingSize * 1.3;
    const bodyLine = bodySize * 1.4;

    const cardPaddingX = 20;
    const cardPaddingY = 18;
    const cardGap = 28;

    let { page, width, contentTop, contentBottom } = addFramedPage(
      "Your priority plan"
    );
    const cardWidth = width - marginX * 2;
    let currentTop = contentTop;

    const ensureSpace = (needed: number) => {
      if (currentTop - needed < contentBottom) {
        // new page with same layout label
        const next = addFramedPage("Your priority plan (continued)");
        page = next.page;
        ({ contentTop, contentBottom } = next);
        currentTop = contentTop;
      }
    };

    const drawPriorityCard = (
      index: number,
      channel: string,
      title: string,
      why: string,
      actions: string[]
    ) => {
      const paragraphs = [
        `[${channel}] ${title}`,
        "",
        "Why this matters",
        why,
        "",
        "Actions to take next",
      ];

      const textLines: string[] = [];

      paragraphs.forEach((p) => {
        if (!p) {
          textLines.push("");
        } else if (p === "Why this matters" || p === "Actions to take next") {
          textLines.push(p);
        } else {
          textLines.push(...wrapText(p, 88));
        }
      });

      actions.forEach((a) => {
        textLines.push(...wrapText(`• ${a}`, 86));
      });

      const textLinesCount = textLines.filter((l) => l !== "").length;
      const estimatedHeight =
        cardPaddingY * 2 + headingLine + textLinesCount * bodyLine + 32;

      ensureSpace(estimatedHeight);

      const x = marginX;
      const yBottom = currentTop - estimatedHeight;

      page.drawRectangle({
        x,
        y: yBottom,
        width: cardWidth,
        height: estimatedHeight,
        color: rgb(0x34 / 255, 0x40 / 255, 0x45 / 255),
        // @ts-ignore rounded corners if supported
        radius: 12,
      });

      let textY = currentTop - cardPaddingY - headingSize;

      // Card index
      page.drawText(`#${index + 1}`, {
        x: x + cardPaddingX,
        y: textY,
        size: 10,
        font: headingFont,
        color: grey,
      });

      // Title line (channel + title already combined in first paragraph)
      const firstLine = `[${channel}] ${title}`;
      page.drawText(firstLine, {
        x: x + cardPaddingX + 30,
        y: textY,
        size: headingSize,
        font: headingFont,
        color: white,
      });

      textY -= headingLine;

      for (const line of textLines) {
        if (!line) {
          textY -= bodyLine * 0.4;
          continue;
        }

        let colour = rgb(0.94, 0.96, 0.97);

        if (line === "Why this matters" || line === "Actions to take next") {
          colour = white;
        }

        page.drawText(line, {
          x: x + cardPaddingX,
          y: textY,
          size: bodySize,
          font: bodyFont,
          color: colour,
        });
        textY -= bodyLine;
      }

      currentTop = yBottom - cardGap;
    };

    priorities.forEach((p, index) => {
      drawPriorityCard(index, p.channel, p.title, p.why, p.actions);
    });
  }

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}

// Simple character-based wrap so cards stay neat
function wrapText(text: string, maxChars: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const test = current ? `${current} ${word}` : word;
    if (test.length > maxChars) {
      if (current) lines.push(current);
      current = word;
    } else {
      current = test;
    }
  }

  if (current) lines.push(current);
  return lines;
}