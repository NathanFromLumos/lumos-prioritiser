export type ChannelKey =
  | "foundations"
  | "website"
  | "seo"
  | "email"
  | "ppc"
  | "social";

export type QuestionOption = {
  id: string;
  label: string;
  score: number; // 0–4 scale for later scoring
};

export type Question = {
  id: string;
  channel: ChannelKey;
  prompt: string;
  helper?: string;
  options: QuestionOption[];
};

export type AnswersMap = Record<string, string>; // questionId -> optionId

export type ChannelScores = Record<ChannelKey, number>; // 0–100 per channel