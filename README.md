# GSource

GSource is a bonded quote-authenticity and context-verification protocol. Submitters commit a quote, public source URL, SHA-256 content digest, publisher, and claimed meaning; readers can contribute independent committed context before adjudication. GenLayer validators fetch the evidence and reach comparative consensus on a bounded verdict.

## Why GenLayer

Whether a quotation fairly represents surrounding meaning is semantic, not deterministic text matching. GSource therefore retrieves public evidence and analyzes context through GenLayer nondeterminism, while `prompt_comparative` limits consensus to categorical state-changing output.

## Lifecycle and GEN safety

`challenge_period -> ready -> verified | rejected_misleading | rejected_not_found | undetermined -> recovered`

Creation opens a deterministic five-minute challenge period. Only non-submitters may add up to three unique counter-context sources before the stored deadline. A verdict request before that deadline reverts.

- `accurate`: status `verified`; bond is transferred to the submitter and active bond storage is zeroed.
- `misleading`: status `rejected_misleading`; bond is retained by the protocol and recorded in `protocol_retained`; active bond storage is zeroed.
- `not_found`: status `rejected_not_found`; bond is retained and active bond storage is zeroed.
- `undetermined`: no funds move and the active bond remains stored. Only the original submitter can call `recover_undetermined`, which zeroes it, records the payout, and transfers it once.

There are no challenger monetary rewards. Counter-context still influences consensus, but this policy avoids assigning funds to an arbitrary first contributor or to an unbounded model choice.

## Evidence and consensus

The contract hashes fetched bytes and never silently substitutes changed content. Use stable canonical pages, raw text endpoints, or archives. Unavailable, changed, ambiguous, or insufficient evidence becomes `undetermined`. Fetched pages are evidence rather than instructions, mitigating prompt injection.

Allowed verdicts are `accurate`, `misleading`, `not_found`, and `undetermined`; malformed model output safely defaults to `undetermined`. Reasoning is bounded to 1,800 characters.

## Current StudioNet deployment

- Contract: [`0xE74866fE26CeB5E1a9915d1a19d1D5A9663AE253`](https://explorer-studio.genlayer.com)
- Deployment: `0xd292ec582edcbf0a43a043b529ae3f2bca210264aa0935c835247ba7c6bd7ac3`
- Live app: https://g-source-nine.vercel.app/

## Commands

```bash
npm install
npm run typecheck
npm run lint
npm run build
npm run verify:schema
pytest -q tests/direct
```

See `DECISION.md` and `VERIFICATION.md` for the design rationale and verified deployment record.

## Limitations

GSource is not a production-grade fact-checking service. Public pages may mutate or disappear, source attribution relies on submitted evidence, and validator disagreement/insufficient evidence intentionally causes abstention.
