# GSource

GSource is a bonded quote-authenticity and context-verification protocol. A submitter commits a quote, stable public source URL, SHA-256 digest, and claimed meaning. Readers may add independently committed counter-context. GenLayer validators fetch public evidence and reach consensus on a bounded semantic verdict.

## Why GenLayer

Exact text matching cannot decide whether surrounding context supports a claim. A centralized fact-check API adds a trust assumption. GSource keeps retrieval and semantic judgment in GenLayer nondeterministic execution, then uses `prompt_comparative` so validators agree on state-changing categorical fields while reasoning prose may differ.

## State machine and bond flow

`challenge_period -> ready -> verified | rejected_misleading | rejected_not_found | undetermined -> recovered`

Creation starts a deterministic five-minute challenge window. Counter-context is accepted only before its deadline and only from non-submitters. Verdict requests fail before the deadline.

- `accurate`: submitter receives the bond; status is `verified`.
- `misleading`: status is `rejected_misleading`. A challenger receives the bond only when consensus explicitly says committed counter-context materially supports the conclusion; otherwise it is retained and recorded in `protocol_retained`.
- `not_found`: status is `rejected_not_found`; the failed claim's bond is retained and accounted for.
- `undetermined`: status is `undetermined`; the submitter has one deterministic recovery path, producing `recovered`.

The bond ledger is zeroed on every terminal settlement. Payout and retained fields record each destination, so no terminal path leaves an internal bond liability outstanding.

## Evidence and consensus

Deterministic operations validate input, store commitments, enforce timing/duplicates, and settle GEN. `request_verdict` fetches primary and counter sources, verifies exact SHA-256 bytes, and calls `gl.nondet.exec_prompt`. Comparative consensus covers `verdict` and `challenger_materially_supports`, not arbitrary prose. Allowed verdicts are `accurate`, `misleading`, `not_found`, and `undetermined`. Inaccessible, changed, ambiguous, or insufficient evidence abstains to `undetermined`.

URLs should be stable canonical text endpoints, static pages, or archived snapshots. Raw HTML is hashed without unsafe normalization; a changed page is rejected rather than silently substituted. Fetched pages are evidence, never instructions, so prompt-injection text cannot redefine the task.

## Development

```bash
npm install
npm run typecheck
npm run lint
npm run build
npm run verify:schema
gltest run --network localnet
```

See `DECISION.md` for design rationale and `VERIFICATION.md` for reproducible proof. StudioNet deployment data is recorded only when credentials and real lifecycle transactions are available.

## StudioNet proof

Final hardened deployment: `0x835ce17576C1C0Cb11a266Cf551D1e4979347911`.

- Deployment: `0x2d4374037c8587ee65596ec69440a79c58f0485a291dcb098129a7d59f7f699a`
- Create lifecycle: `0xe03dbd6ac1207086de3ff0f87c4f8a85b0894035f775456955e70dd0f34e7802`
- Counter-context: `0x65886d58e2b548e3d0d6d292a6ba57b5cdd4215a0c366904b6b71a9d0c17402f`
- Comparative verdict: `0xfc069859636a44873a4d2977716a8300393b4c991497535689a325689b77bc7d`

The lifecycle finalized `accurate`, stored `verified`, and paid the 0.01 GEN bond to the submitter. Explorer: https://genlayer-explorer.vercel.app

## Honest limitations

GSource is not production-grade fact checking. Public pages mutate or disappear, archives may be incomplete, semantic disagreement can yield abstention, and source-authentication depends on the submitted publisher and commitment. StudioNet availability, fees, and external web access affect integration runs.
