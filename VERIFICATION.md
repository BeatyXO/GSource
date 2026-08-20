# GSource verification record

## Repository and source

- Final source file: `contracts/gsource.py`.
- SHA-256 source hash: `8d9cf8b7fb678366f0d1b8b6c847531efa423e00228802e35f0c984166c1586f`.
- GenLayer dependency: `py-genlayer:1jb45aa8ynh2a9c9xn3b7qqh8sm5q93hwfp7jqmwsfhh8jpz09h6`.
- Canonical deployed contract source commit: `9bd3a98378def1213f620cfc102124c9ec5a7975`.
- Current repository head: `63bc304026e476441dfbac8479b223010641e6df`.
- Commit `63bc304026e476441dfbac8479b223010641e6df` only records live Vercel verification in this file; it does not modify contract or frontend source. The StudioNet deployment therefore corresponds to the contract source from commit `9bd3a98378def1213f620cfc102124c9ec5a7975`.

## Executed checks

- Direct contract tests: `pytest -q tests/direct` — **6 passed, 0 failed**. The tests use `gltest.direct.VMContext`, execute deployed contract methods, mock web/LLM calls, and inspect stored accounting.
- TypeScript: `npm run typecheck` — passed.
- Schema check: `npm run verify:schema` — passed (`7 invariants`).
- Python syntax: `python -m py_compile contracts/gsource.py` — passed.
- `npm run build` was invoked in this desktop environment; Next.js began its optimized build but the runner did not return a final completion record. It is not claimed as verified here.

## Canonical StudioNet deployment

- Contract: `0xE74866fE26CeB5E1a9915d1a19d1D5A9663AE253`.
- Deployment transaction: `0xd292ec582edcbf0a43a043b529ae3f2bca210264aa0935c835247ba7c6bd7ac3`.
- Deployment timestamp: `2026-08-20T15:54:10.952380Z`.
- Explorer: https://explorer-studio.genlayer.com

The deployment receipt contains the contract source submitted by the CLI. Its local SHA-256 is recorded above; the repository commit must be compared after committing this exact source. No stronger byte-for-byte explorer source-hash API was available during this run.

## Live undetermined recovery lifecycle

- Create bonded check: `0xf71e67165905757554af665cd979bbb676ff88ade26290139a6060dfe8440b55`.
- Verdict: `0x28be87b6d3373ef55b26389f3d1b9d7dd9dc386785d3994ce7dc16c9285bffdb`.
- Recovery: `0x14da90bdedfd425d335c26830efa092d300901a14c3e9d7fc897750be9dd286e`.

The check used an intentionally wrong SHA-256 commitment. StudioNet consensus finalized `undetermined`; the 10,000,000,000,000,000 wei bond remained available; recovery finalized `recovered`, recorded the exact submitter payout, and no challenger/protocol amount was recorded.

## Frontend

- Production URL: https://g-source-nine.vercel.app/
- Required public environment values are in `.env.local.example`, including the canonical StudioNet contract and official StudioNet explorer.
- Live verification on 2026-08-20: https://g-source-nine.vercel.app/checks displayed the canonical contract's `Undetermined recovery proof` record (`/checks/0`) as `recovered`, with no browser console errors. This confirms the production frontend is using the canonical contract address.
