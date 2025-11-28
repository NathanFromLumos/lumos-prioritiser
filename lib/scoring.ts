import { QUESTIONS } from "./questions";
import type { AnswersMap, ChannelKey, ChannelScores } from "./types";

export function calculateChannelScores(answers: AnswersMap): ChannelScores {
  // Start scores at 0 for each channel
  const scores: ChannelScores = {
    foundations: 0,
    website: 0,
    seo: 0,
    email: 0,
    ppc: 0,
    social: 0,
  };

  const totals: Record<ChannelKey, number> = {
    foundations: 0,
    website: 0,
    seo: 0,
    email: 0,
    ppc: 0,
    social: 0,
  };

  // Walk all questions and add up scores per channel
  for (const question of QUESTIONS) {
    const answerId = answers[question.id];
    if (!answerId) continue;

    const option = question.options.find((o) => o.id === answerId);
    if (!option) continue;

    const channel = question.channel;
    const maxScoreForQuestion = 4; // highest option score

    scores[channel] += option.score;
    totals[channel] += maxScoreForQuestion;
  }

  // Convert raw scores to 0–100 percentages
  (Object.keys(scores) as ChannelKey[]).forEach((channel) => {
    const max = totals[channel] || 1; // avoid divide-by-zero
    const raw = (scores[channel] / max) * 100;
    scores[channel] = Math.round(raw);
  });

  return scores;
}