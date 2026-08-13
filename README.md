# GSource

GSource is a public quote-authenticity and context checker for journalists, researchers, and newsletter teams. A submitter locks GEN beside an exact quote, public URL, SHA-256 source commitment, and claimed meaning. A reader can add independently committed counter-context. GenLayer fetches the sources itself and uses comparative validator consensus to decide whether the quote is accurate, misleading, not found, or undetermined.

## Why GenLayer

Text matching cannot decide whether a quote's surrounding context supports the story's meaning. The contract makes the semantic decision only after validators fetch the committed primary and counter sources. It never treats a submitter's note as fact. Changed or inaccessible evidence produces `undetermined`, not a guess.

## Deployed proof

- Contract: `0x343A71530f9dC7c0484B6ceE36c59325Ca50D2F4` on StudioNet
- Create: `0x8dacc447a35c054e7fedc99b729d2eee1601ae3be6582620566fd7b8edaf7f7e`
- Counter context: `0xf15ec7d5ee307bf4cae3203f832bd755f909414c58527f364ece2bae6344f729`
- Consensus verdict: `0x274fe587c34854ef4e5c71888c538491d0555e6c3141f7fe56bd562843129256`

The cycle returned `accurate` with high confidence and released the `0.01 GEN` bond to the submitter.

## Contract surface

Deterministic reads: `get_check`, `get_checks`, `get_counter_context`.

Deterministic writes: `create_check`, `submit_counter_context`, `recover_undetermined`.

Non-deterministic write: `request_verdict`, which uses `prompt_comparative`. Validators must reach the same categorical conclusion; prose wording may differ but the decision cannot.

## Settlement safety

Accurate or not-found checks release the bond to the submitter. A misleading conclusion with a counterparty releases it to that challenger. An undetermined result lets the submitter recover it. No terminal state leaves a recorded bond trapped.

## Run locally

```bash
npm install
cp .env.local.example .env.local
npm run dev
```
