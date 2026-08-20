"use client";

import { useParams } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { explainError, getCheck, getCounterContext, identity, write } from "@/lib/genlayer";
import { gen, type CounterContext, type QuoteCheck } from "@/lib/types";
import { useWallet } from "@/lib/wallet";

const countdown = (deadline: string, now: number) => {
  const seconds = Math.max(0, Math.ceil(Number(deadline) - now));
  return seconds ? `${Math.floor(seconds / 60)}m ${seconds % 60}s remaining` : "Challenge period ended";
};

export default function Detail() {
  const { id } = useParams<{ id: string }>();
  const wallet = useWallet();
  const [item, setItem] = useState<QuoteCheck>();
  const [context, setContext] = useState<CounterContext[]>([]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [now, setNow] = useState(() => Math.floor(Date.now() / 1000));
  const load = () => Promise.all([getCheck(id), getCounterContext(id)]).then(([check, sources]) => { setItem(check); setContext(sources); }).catch((reason) => setError(explainError(reason)));

  useEffect(() => { void load(); }, [id]);
  useEffect(() => { const timer = window.setInterval(() => setNow(Math.floor(Date.now() / 1000)), 1000); return () => window.clearInterval(timer); }, []);

  async function act(name: string, args: string[] = []) {
    try { setBusy(true); setError(""); await write(identity(wallet.mode, wallet.address, wallet.privateKey), name, [id, ...args]); await load(); }
    catch (reason) { setError(explainError(reason)); }
    finally { setBusy(false); }
  }
  async function add(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); const form = new FormData(event.currentTarget);
    await act("submit_counter_context", [String(form.get("url")), String(form.get("hash")), String(form.get("note"))]);
  }

  if (!item) return <p className="text-court-200">Loading on-chain record…</p>;
  const isSubmitter = wallet.address?.toLowerCase() === item.submitter.toLowerCase();
  const isChallenge = item.status === "challenge_period";
  const deadlinePassed = now >= Number(item.challenge_deadline);
  const canAdd = isChallenge && !deadlinePassed && Boolean(wallet.address) && !isSubmitter;
  const canRequest = (item.status === "challenge_period" || item.status === "ready") && deadlinePassed;

  return <div className="grid gap-6 lg:grid-cols-[1.35fr_.65fr]">
    <article className="border border-court-400/30 bg-court-950/45 p-6">
      <p className="text-xs uppercase tracking-[.25em] text-court-400">Quote check #{id} · {item.status}</p>
      <h1 className="mt-3 font-display text-4xl text-court-100">{item.title}</h1>
      <blockquote className="mt-7 border-l-2 border-court-400 pl-5 font-display text-2xl leading-9 text-court-100">“{item.quote}”</blockquote>
      <dl className="mt-8 grid gap-5 text-sm"><div><dt className="text-court-400">Claimed meaning</dt><dd className="mt-1 leading-6 text-court-100">{item.claimed_meaning}</dd></div><div><dt className="text-court-400">Primary source</dt><dd className="mt-1 break-all text-court-100 underline"><a href={item.source_url} target="_blank" rel="noreferrer">{item.source_url}</a></dd></div></dl>
      {item.reasoning && <div className="mt-8 border-t border-court-400/20 pt-5"><p className="text-xs uppercase tracking-[.2em] text-court-400">Consensus finding · {item.verdict} · {item.confidence_band}</p><p className="mt-3 leading-7 text-court-100">{item.reasoning}</p></div>}
    </article>
    <aside className="space-y-4">
      <section className="border border-court-400/30 bg-court-950/45 p-5"><p className="text-xs uppercase tracking-[.2em] text-court-400">Bond</p><p className="mt-2 font-display text-4xl text-court-100">{gen(item.bond)} GEN</p><dl className="mt-3 grid gap-1 text-xs text-court-200"><div>Paid to submitter: {gen(item.paid_to_submitter)} GEN</div><div>Paid to challenger: {gen(item.paid_to_challenger)} GEN</div><div>Protocol retained: {gen(item.protocol_retained)} GEN</div></dl></section>
      {isChallenge && <section className="border border-court-400/30 bg-court-950/45 p-5"><p className="text-xs uppercase tracking-[.2em] text-court-400">Challenge period</p><p className="mt-2 text-court-100">Deadline: {new Date(Number(item.challenge_deadline) * 1000).toLocaleString()}</p><p className="mt-1 text-sm text-court-200">{countdown(item.challenge_deadline, now)}. A verdict cannot be requested before this deadline.</p></section>}
      {canAdd && <form onSubmit={add} className="grid gap-3 border border-court-400/30 bg-court-950/45 p-5"><h2 className="font-display text-2xl text-court-100">Add counter-context</h2><input name="url" type="url" placeholder="Public context URL" required /><input name="hash" pattern="0x[0-9a-fA-F]{64}" placeholder="Context SHA-256" required /><textarea name="note" placeholder="Why this source changes the reading" required /><button disabled={busy} className="rounded-md bg-court-400 px-4 py-2 font-bold text-court-950">Add source</button></form>}
      {isChallenge && isSubmitter && !deadlinePassed && <p className="border border-court-400/20 p-4 text-sm text-court-200">Only other readers may add counter-context during this window. You may request a verdict after it ends.</p>}
      {canRequest && <button disabled={!wallet.address || busy} onClick={() => void act("request_verdict")} className="w-full rounded-md border border-court-400/70 px-4 py-3 font-bold text-court-100">Request GenLayer verdict</button>}
      {item.status === "undetermined" && isSubmitter && <button disabled={busy} onClick={() => void act("recover_undetermined")} className="w-full rounded-md bg-court-400 px-4 py-3 font-bold text-court-950">Recover bond</button>}
      <section className="border border-court-400/20 p-5"><h2 className="font-display text-xl text-court-100">Context sources</h2>{context.map((source, index) => <a className="mt-3 block break-all text-sm text-court-200 underline" target="_blank" rel="noreferrer" href={source.url} key={index}>{source.note}</a>)}{!context.length && <p className="mt-3 text-sm text-court-400">No counter-context added.</p>}</section>
      {error && <p className="border border-red-400/50 p-3 text-sm text-red-200">{error}</p>}
    </aside>
  </div>;
}
