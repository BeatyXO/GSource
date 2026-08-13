"use client";
import { createAccount, createClient } from "genlayer-js";
import { studionet } from "genlayer-js/chains";
import { ExecutionResult, TransactionStatus } from "genlayer-js/types";
import type { CounterContext, QuoteCheck } from "./types";

type Input = string | number | bigint;
type Identity = { mode: "browser"; privateKey: string } | { mode: "injected"; address: string };
export const contractAddress = process.env.NEXT_PUBLIC_GSOURCE_CONTRACT_ADDRESS as `0x${string}` | undefined;
export const explorer = process.env.NEXT_PUBLIC_GENLAYER_EXPLORER_URL || "https://genlayer-explorer.vercel.app";
const GAP = 2500; const CACHE = 8000; let queue = Promise.resolve(); let last = 0; const cache = new Map<string, { expires: number; value: unknown }>();
async function queued<T>(job: () => Promise<T>) { const task = queue.then(async () => { const wait = Math.max(0, GAP - Date.now() + last); if (wait) await new Promise(r => setTimeout(r, wait)); last = Date.now(); return job(); }); queue = task.then(() => undefined, () => undefined); return task; }
const getRead = () => createClient({ chain: studionet, account: createAccount() });
async function clientFor(identity: Identity) { if (identity.mode === "browser") return createClient({ chain: studionet, account: createAccount(identity.privateKey as `0x${string}`) }); const client = createClient({ chain: studionet, account: identity.address as `0x${string}` }); await client.connect("studionet"); return client; }
function requireAddress() { if (!contractAddress) throw new Error("Configure NEXT_PUBLIC_GSOURCE_CONTRACT_ADDRESS before using GSource."); return contractAddress; }
async function read<T>(name: string, args: Input[] = []) { const k = `${name}:${JSON.stringify(args)}`; const saved = cache.get(k); if (saved && saved.expires > Date.now()) return saved.value as T; return queued(async () => { const value = await getRead().readContract({ address: requireAddress(), functionName: name, args: args as never[] }); const parsed = typeof value === "string" ? JSON.parse(value) : value; cache.set(k, { expires: Date.now() + CACHE, value: parsed }); return parsed as T; }); }
export const getChecks = () => read<QuoteCheck[]>("get_checks", [100]);
export const getCheck = (id: string) => read<QuoteCheck>("get_check", [id]);
export const getCounterContext = (id: string) => read<CounterContext[]>("get_counter_context", [id]);
export async function write(identity: Identity, name: string, args: Input[], value = 0n) { const client = await clientFor(identity); const hash = await client.writeContract({ address: requireAddress(), functionName: name, args: args as never[], value }); const receipt = await client.waitForTransactionReceipt({ hash, status: TransactionStatus.FINALIZED, interval: 30000, retries: 20 }); if (receipt.txExecutionResultName === ExecutionResult.FINISHED_WITH_ERROR) throw new Error(`Contract execution failed for ${name}. Check ${explorer}/transactions/${hash}`); cache.clear(); return { hash: hash as string }; }
export function identity(mode: string, address?: string, privateKey?: string): Identity { if (mode === "browser" && privateKey) return { mode: "browser", privateKey }; if (mode === "injected" && address) return { mode: "injected", address }; throw new Error("Connect a browser or injected wallet first."); }
export function explainError(error: unknown) { const message = error instanceof Error ? error.message : String(error); if (message.includes("Rate limit")) return "StudioNet is rate-limiting requests. Your transaction may still be processing; wait before refreshing."; if (message.includes("EXPECTED:")) return message.replace("EXPECTED:", ""); if (message.includes("EXTERNAL:")) return "The public source could not be fetched. Try again later or use a stable public URL."; return message || "Transaction failed. Try again from the check detail page."; }
