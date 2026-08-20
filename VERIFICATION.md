# GSource verification record

This record contains no fabricated deployment claims. Deployment credentials were not present in the workspace during this audit, so no new StudioNet address or transaction hash is claimed.

- Audited commit: `a5dfbd8d8ca8f6900203d5b7788f6b5379ce3113`.
- Contract source: `contracts/gsource.py` with pinned `py-genlayer:1jb45aa8ynh2a9c9xn3b7qqh8sm5q93hwfp7jqmwsfhh8jpz09h6`.
- Direct tests: `gltest run --network localnet` (record actual output after execution).
- Frontend: `npm run typecheck`, `npm run lint`, `npm run build`.
- StudioNet contract: `0x835ce17576C1C0Cb11a266Cf551D1e4979347911`.
- Deployment transaction: `0x2d4374037c8587ee65596ec69440a79c58f0485a291dcb098129a7d59f7f699a`.
- Real lifecycle: create `0xe03dbd6ac1207086de3ff0f87c4f8a85b0894035f775456955e70dd0f34e7802`; counter-context `0x65886d58e2b548e3d0d6d292a6ba57b5cdd4215a0c366904b6b71a9d0c17402f`; verdict `0xfc069859636a44873a4d2977716a8300393b4c991497535689a325689b77bc7d`.
- Integration result: finalized `accurate` / `verified`, high confidence, 10,000,000,000,000,000 wei paid to submitter, zero retained and zero challenger payout. Five validators reached quorum.
- Parity: frontend address comes only from `NEXT_PUBLIC_GSOURCE_CONTRACT_ADDRESS`; deployed-source parity requires final source hash and deployment artifact.
