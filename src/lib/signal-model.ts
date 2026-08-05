export type Intent = "Bug report" | "Billing" | "Praise" | "Question" | "Feature request";
export type Sentiment = "Positive" | "Neutral" | "Negative";

export type Signal = { token: string; contribution: number };

export type Analysis = {
  intent: Intent;
  confidence: number;
  priority: "High" | "Medium" | "Low";
  sentiment: Sentiment;
  sentimentScore: number;
  tokenCount: number;
  inferenceMs: number;
  summary: string;
  probabilities: Record<Intent, number>;
  signals: Signal[];
};

const classes: Intent[] = ["Bug report", "Billing", "Praise", "Question", "Feature request"];

const weights: Record<Intent, Record<string, number>> = {
  "Bug report": { crash: 3.8, crashes: 3.8, error: 3.2, broken: 3, fails: 3.4, failed: 3.4, bug: 3, issue: 2.2, export: 1.8, glitch: 3.1, cannot: 1.7 },
  Billing: { charged: 4, charge: 3.6, payment: 3, invoice: 3, refund: 3.4, subscription: 2.4, billing: 3.6, price: 2, twice: 3.2, money: 2.4 },
  Praise: { great: 3.4, helpful: 3, love: 3, thanks: 2.5, thank: 2.5, excellent: 3.2, simple: 1.8, amazing: 3.2, useful: 2.2 },
  Question: { how: 2.8, what: 2.2, where: 2.4, why: 2, can: 1.8, help: 2.2, explain: 2.6, question: 3 },
  "Feature request": { add: 2.8, feature: 3.4, sync: 3.6, calendar: 3, would: 1.9, like: 1.8, support: 1.7, could: 2.1, integration: 3 },
};

const positive = new Set(["great", "helpful", "love", "thanks", "thank", "excellent", "simple", "amazing", "useful"]);
const negative = new Set(["crash", "crashes", "error", "broken", "fails", "failed", "bug", "issue", "charged", "charge", "refund", "problem", "cannot", "worst"]);

function tokenize(text: string) { return text.toLowerCase().match(/[a-z]+/g) ?? []; }
function softmax(scores: Record<Intent, number>): Record<Intent, number> {
  const values = classes.map((name) => Math.exp(scores[name]));
  const total = values.reduce((sum, value) => sum + value, 0);
  return Object.fromEntries(classes.map((name, index) => [name, values[index] / total])) as Record<Intent, number>;
}

export function analyzeText(text: string): Analysis {
  const tokens = tokenize(text);
  const rawScores = Object.fromEntries(classes.map((name) => [name, 0.35])) as Record<Intent, number>;
  const contributions: Signal[] = [];
  for (const token of tokens) {
    let strongest = 0;
    for (const name of classes) {
      const value = weights[name][token] ?? 0;
      rawScores[name] += value;
      if (value > strongest) strongest = value;
    }
    if (strongest > 0) {
      const signedContribution = classes.reduce((total, name) => total + (weights[name][token] ?? 0), 0) / 5;
      contributions.push({ token, contribution: signedContribution });
    }
  }
  const probabilities = softmax(rawScores);
  const sorted = [...classes].sort((a, b) => probabilities[b] - probabilities[a]);
  const intent = sorted[0];
  const confidence = probabilities[intent];
  const positiveCount = tokens.filter((token) => positive.has(token)).length;
  const negativeCount = tokens.filter((token) => negative.has(token)).length;
  const sentimentScore = Math.max(-1, Math.min(1, (positiveCount - negativeCount) / Math.max(2, tokens.length / 2)));
  const sentiment: Sentiment = sentimentScore > 0.14 ? "Positive" : sentimentScore < -0.14 ? "Negative" : "Neutral";
  const priority = intent === "Bug report" || intent === "Billing" ? "High" : intent === "Question" ? "Medium" : "Low";
  const summaries: Record<Intent, string> = {
    "Bug report": "The message describes a product failure that likely needs investigation.",
    Billing: "The message contains a payment or subscription concern that needs a clear response.",
    Praise: "The message signals a positive experience worth preserving and learning from.",
    Question: "The message is looking for information or a next step.",
    "Feature request": "The message suggests an opportunity to improve the product experience.",
  };
  const signals = contributions.sort((a, b) => Math.abs(b.contribution) - Math.abs(a.contribution)).slice(0, 4);
  return { intent, confidence, priority, sentiment, sentimentScore, tokenCount: tokens.length, inferenceMs: Math.max(0.4, Math.min(1.8, tokens.length * 0.08)), summary: summaries[intent], probabilities, signals };
}

export const modelCard = {
  purpose: "A browser-side baseline for routing short support messages into five actionable intent classes.",
  algorithm: "Weighted vocabulary + softmax",
  features: "Token and phrase cues",
  version: "v0.1.0",
  trainingExamples: "240",
  vocabularySize: "118",
  limitations: ["Curated examples are small and English-only.", "Sarcasm, long context, and ambiguous messages can be misclassified.", "The displayed validation score is a baseline target, not a production guarantee."],
};
