import type { Question } from "./types";

export const QUESTIONS: Question[] = [
  // FOUNDATIONS
  {
    id: "foundations_tracking",
    channel: "foundations",
    prompt:
      "How confident are you that your revenue tracking is accurate across key channels?",
    helper: "Think GA4, Google Ads, Meta Ads and your ecommerce platform.",
    options: [
      { id: "a", label: "Very confident – we review it weekly", score: 4 },
      { id: "b", label: "Mostly – some gaps but usable", score: 3 },
      { id: "c", label: "Not really – partial tracking only", score: 2 },
      { id: "d", label: "Not at all – we’re basically flying blind", score: 0 },
    ],
  },

  // WEBSITE
  {
    id: "website_speed",
    channel: "website",
    prompt: "How would you describe your website’s speed and stability?",
    options: [
      { id: "a", label: "Fast and reliable on mobile and desktop", score: 4 },
      { id: "b", label: "Generally OK, a bit slow at times", score: 3 },
      { id: "c", label: "Noticeably slow or glitchy", score: 1 },
      { id: "d", label: "Frequently slow or crashes", score: 0 },
    ],
  },

  // SEO
  {
    id: "seo_structure",
    channel: "seo",
    prompt: "How structured is your SEO content strategy?",
    helper: "Think topic clusters, pillar pages and internal linking.",
    options: [
      { id: "a", label: "Clear clusters and pillars for key journeys", score: 4 },
      { id: "b", label: "Some themes but no real structure", score: 2 },
      { id: "c", label: "We publish ad hoc when we can", score: 1 },
      { id: "d", label: "We don’t really do SEO content", score: 0 },
    ],
  },

  // EMAIL
  {
    id: "email_flows",
    channel: "email",
    prompt: "Which automated email flows do you currently have live?",
    helper: "Pick the option that fits best overall.",
    options: [
      {
        id: "a",
        label: "Welcome, abandon, post-purchase and win-back",
        score: 4,
      },
      {
        id: "b",
        label: "A couple of basics (e.g. welcome + abandon)",
        score: 3,
      },
      {
        id: "c",
        label: "Only newsletters/campaigns, no automations",
        score: 1,
      },
      { id: "d", label: "We don’t really send email", score: 0 },
    ],
  },

  // PPC
  {
    id: "ppc_structure",
    channel: "ppc",
    prompt:
      "How structured are your paid campaigns across Google and/or Meta right now?",
    options: [
      {
        id: "a",
        label: "Clear naming, audiences and testing plan",
        score: 4,
      },
      {
        id: "b",
        label: "Some structure but it’s a bit messy",
        score: 2,
      },
      { id: "c", label: "It’s basically a free-for-all", score: 1 },
      { id: "d", label: "We don’t run paid campaigns", score: 0 },
    ],
  },

  // SOCIAL
  {
    id: "social_consistency",
    channel: "social",
    prompt: "How consistent is your organic social presence?",
    options: [
      {
        id: "a",
        label: "We post with a clear plan at least 3x per week",
        score: 4,
      },
      {
        id: "b",
        label: "We post weekly but it isn’t very planned",
        score: 2,
      },
      {
        id: "c",
        label: "We post occasionally when someone remembers",
        score: 1,
      },
      { id: "d", label: "We’re basically dormant", score: 0 },
    ],
  },
];