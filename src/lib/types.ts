export type QuoteStatus = "open" | "verified" | "slashed" | "undetermined" | "recovered";

export type QuoteCheck = {
  id: string; title: string; quote: string; source_url: string; claimed_meaning: string;
  submitter: string; challenger: string; bond: string; status: QuoteStatus;
  verdict: "" | "accurate" | "misleading" | "not_found" | "undetermined";
  confidence_band: "" | "low" | "medium" | "high"; reasoning: string; created_at: string;
  paid_to_submitter: string; paid_to_challenger: string;
};

export type CounterContext = { url: string; content_hash: string; note: string; submitter: string };
export type WriteStage = "idle" | "signing" | "pending" | "finalized" | "failed";
export const shortAddress = (value?: string) => value ? `${value.slice(0, 6)}…${value.slice(-4)}` : "—";
export const gen = (value: string) => {
  const amount = BigInt(value || "0"); const whole = amount / 10n ** 18n;
  const decimal = (amount % 10n ** 18n).toString().padStart(18, "0").slice(0, 3).replace(/0+$/, "");
  return decimal ? `${whole}.${decimal}` : whole.toString();
};
