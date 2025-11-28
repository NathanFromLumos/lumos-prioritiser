import type { ChannelKey, ChannelScores } from "./types";

export type Priority = {
  id: string;
  channel: ChannelKey;
  title: string;
  why: string;
  actions: string[];
};

type Severity = "critical" | "improve" | "optimise" | "maintain";

function getSeverity(score: number): Severity {
  if (score <= 25) return "critical";
  if (score <= 50) return "improve";
  if (score <= 75) return "optimise";
  return "maintain";
}

function priorityForChannel(
  channel: ChannelKey,
  score: number
): Priority | null {
  const severity = getSeverity(score);

  if (severity === "maintain") {
    return null;
  }

  switch (channel) {
    case "foundations":
      if (severity === "critical") {
        return {
          id: "foundations-critical",
          channel,
          title: "Fix your measurement and tracking first.",
          why: "If you can't trust your numbers, every other decision becomes guesswork. Fixing tracking makes all other work compounding instead of random.",
          actions: [
            "Audit key journeys in GA4, your ecommerce platform and ad platforms.",
            "Set up or verify purchase and lead events with clear naming.",
            "Agree a simple weekly metrics snapshot you can actually review.",
          ],
        };
      }
      if (severity === "improve") {
        return {
          id: "foundations-improve",
          channel,
          title: "Tighten up your measurement framework.",
          why: "You have some data, but gaps or inconsistencies are holding back better optimisation and budget decisions.",
          actions: [
            "Standardise naming conventions across GA4, Google Ads and Meta.",
            "Close obvious tracking gaps on key conversion paths.",
            "Document a simple measurement plan so the whole team knows what 'good' looks like.",
          ],
        };
      }
      if (severity === "optimise") {
        return {
          id: "foundations-optimise",
          channel,
          title: "Formalise your weekly trading rhythm.",
          why: "Your tracking is in a good place; the next lift comes from consistent review and decision-making.",
          actions: [
            "Create a one-page weekly trading dashboard.",
            "Define 2–3 default checks you run every week (e.g. CPA, ROAS, CVR by channel).",
            "Schedule a 30–45 minute recurring review with the right people in the room.",
          ],
        };
      }
      break;

    case "website":
      if (severity === "critical") {
        return {
          id: "website-critical",
          channel,
          title: "Stabilise your website experience.",
          why: "Slow or unreliable sites leak money on every visit. Fixing core stability pays off across every channel.",
          actions: [
            "Run basic performance checks on mobile and desktop (e.g. Lighthouse, WebPageTest).",
            "Tackle obvious quick wins: image compression, caching, removing unused apps/plugins.",
            "Ensure your checkout or lead forms are simple, clear and error-free.",
          ],
        };
      }
      if (severity === "improve") {
        return {
          id: "website-improve",
          channel,
          title: "Improve speed and clarity on key journeys.",
          why: "Visitors are getting through, but friction is likely holding back conversion rate.",
          actions: [
            "Identify your top 3 landing pages by traffic and optimise them first.",
            "Tighten hero copy, social proof and primary CTAs on those pages.",
            "Check mobile layouts carefully and fix obvious UX issues.",
          ],
        };
      }
      if (severity === "optimise") {
        return {
          id: "website-optimise",
          channel,
          title: "Test one change on your highest-value page.",
          why: "Small, structured experiments on key pages often yield meaningful conversion lifts.",
          actions: [
            "Pick your highest revenue or lead-driving page.",
            "Run a simple test on messaging, layout or social proof.",
            "Record the outcome and roll out winning patterns elsewhere.",
          ],
        };
      }
      break;

    case "seo":
      if (severity === "critical") {
        return {
          id: "seo-critical",
          channel,
          title: "Put a basic SEO foundation in place.",
          why: "Right now you're likely invisible for important searches. A basic structure will unlock compounding organic growth.",
          actions: [
            "List 5–10 key problems your best customers search for.",
            "Create or improve one practical guide for each of those topics.",
            "Make sure each page has a clear title, H1 and internal links from relevant pages.",
          ],
        };
      }
      if (severity === "improve") {
        return {
          id: "seo-improve",
          channel,
          title: "Move from ad hoc posts to simple clusters.",
          why: "A loose collection of posts won’t build topical authority. Clusters help search engines understand what you’re the best answer for.",
          actions: [
            "Pick one core topic and list the supporting sub-topics.",
            "Make one page your pillar for that topic, then link related posts into it.",
            "Add internal links between related posts to help both users and search engines.",
          ],
        };
      }
      if (severity === "optimise") {
        return {
          id: "seo-optimise",
          channel,
          title: "Tidy up internal linking around your best content.",
          why: "You already have good SEO momentum. Better linking can push key pages further.",
          actions: [
            "Identify your top organic pages by traffic and conversions.",
            "Add internal links from relevant posts into those pages using natural anchor text.",
            "Trim or update any thin, outdated content that no longer serves a purpose.",
          ],
        };
      }
      break;

    case "email":
      if (severity === "critical") {
        return {
          id: "email-critical",
          channel,
          title: "Get core email flows live.",
          why: "You’re leaving easy money on the table by not following up with engaged visitors and customers automatically.",
          actions: [
            "Set up a simple welcome flow for new subscribers or customers.",
            "Create an abandoned basket or browse flow if you sell online.",
            "Make sure every email has a clear, singular call-to-action.",
          ],
        };
      }
      if (severity === "improve") {
        return {
          id: "email-improve",
          channel,
          title: "Strengthen and extend your automated flows.",
          why: "Basic flows are in place, but they could be doing more to retain and grow customers.",
          actions: [
            "Add at least one post-purchase flow focused on education and repeat purchase.",
            "Review subject lines and preview text on existing flows for clarity and curiosity.",
            "Remove or reduce any overly frequent broadcasts that don’t clearly serve the customer.",
          ],
        };
      }
      if (severity === "optimise") {
        return {
          id: "email-optimise",
          channel,
          title: "Test one improvement to your best-performing flow.",
          why: "Optimising what already works will often beat starting something entirely new.",
          actions: [
            "Identify your highest revenue-per-recipient flow.",
            "Test a new offer, layout or social proof section in that flow.",
            "Document the result and replicate successful patterns elsewhere.",
          ],
        };
      }
      break;

    case "ppc":
      if (severity === "critical") {
        return {
          id: "ppc-critical",
          channel,
          title: "Stabilise paid campaigns before you scale.",
          why: "Unstructured paid activity can burn budget quickly without learning anything useful.",
          actions: [
            "Pause obviously underperforming campaigns or ad sets.",
            "Consolidate into a small number of well-defined campaigns with clear goals.",
            "Make sure each ad set/ad group has tightly themed keywords or audiences.",
          ],
        };
      }
      if (severity === "improve") {
        return {
          id: "ppc-improve",
          channel,
          title: "Bring structure and naming discipline to your accounts.",
          why: "A clearer account structure makes it easier to see what’s working and iterate.",
          actions: [
            "Create a simple naming convention for campaigns and ad sets.",
            "Group campaigns by objective (prospecting vs remarketing, for example).",
            "Set a small number of default weekly checks for performance and budget pacing.",
          ],
        };
      }
      if (severity === "optimise") {
        return {
          id: "ppc-optimise",
          channel,
          title: "Run a deliberate test on your strongest campaign.",
          why: "You already have functioning campaigns. Structured tests can unlock further efficiency.",
          actions: [
            "Pick your best campaign by ROAS or cost per lead.",
            "Test a new creative angle or audience while keeping the rest constant.",
            "Review results after a defined period and either roll out or roll back.",
          ],
        };
      }
      break;

    case "social":
      if (severity === "critical") {
        return {
          id: "social-critical",
          channel,
          title: "Choose one core channel and show up consistently.",
          why: "Inconsistent or absent organic presence makes it harder for people to trust you and remember you exist.",
          actions: [
            "Pick the one channel where your customers are most active.",
            "Commit to 2–3 posts per week for the next month.",
            "Focus on helpful, human posts over polished production.",
          ],
        };
      }
      if (severity === "improve") {
        return {
          id: "social-improve",
          channel,
          title: "Move from reactive posting to a simple content rhythm.",
          why: "Posting only when inspiration strikes makes it harder to build momentum.",
          actions: [
            "Define 3–4 recurring content themes (e.g. education, behind the scenes, proof).",
            "Plan your next 2 weeks of posts around those themes.",
            "Block out one batching session each week to draft and schedule content.",
          ],
        };
      }
      if (severity === "optimise") {
        return {
          id: "social-optimise",
          channel,
          title: "Lean into what’s already resonating.",
          why: "Doubling down on proven formats will usually beat chasing every new trend.",
          actions: [
            "Identify your top 5 posts by reach and by saves or replies.",
            "Look for common patterns in topic, format and hook.",
            "Create 3 new posts that deliberately echo those patterns.",
          ],
        };
      }
      break;
  }

  return null;
}

export function generatePriorities(scores: ChannelScores): Priority[] {
  const entries: { channel: ChannelKey; score: number }[] = [
    { channel: "foundations", score: scores.foundations },
    { channel: "website", score: scores.website },
    { channel: "seo", score: scores.seo },
    { channel: "email", score: scores.email },
    { channel: "ppc", score: scores.ppc },
    { channel: "social", score: scores.social },
  ];

  // Sort ascending so weakest areas come first
  entries.sort((a, b) => a.score - b.score);

  const priorities: Priority[] = [];

  for (const entry of entries) {
    const p = priorityForChannel(entry.channel, entry.score);
    if (p) priorities.push(p);
    if (priorities.length >= 5) break;
  }

  return priorities;
}