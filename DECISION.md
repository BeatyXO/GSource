# GSource architecture decisions

GSource exists because quote authenticity is contextual: exact matching cannot determine whether a quote fairly represents surrounding meaning. A centralized backend would make that semantic judgment a trusted service, so evidence retrieval and analysis remain inside GenLayer's nondeterministic execution.

SHA-256 commitments make reviewed bytes auditable. Stable URLs and archived/static sources are preferred; silent canonicalization was rejected because cross-validator normalization could diverge. Categorical consensus was chosen because irreversible settlement must not depend on free-form prose. `undetermined` is deliberate: inaccessible, changed, ambiguous, or insufficient evidence must not become a guessed truth value.

A five-minute challenge window gives readers a practical opportunity to submit committed context before adjudication. Up to three unique contexts are allowed and original submitters cannot add them. GSource deliberately has no challenger monetary reward: counter-context influences the semantic verdict, but a misleading bond is always retained and recorded by the protocol. This avoids an arbitrary first-submitters-wins payout or an LLM-selected payment recipient.
