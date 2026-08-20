# GSource architecture decisions

GSource exists because quote authenticity is contextual: exact matching cannot determine whether a quote fairly represents surrounding meaning. A centralized backend would make that semantic judgment a trusted service, so evidence retrieval and analysis remain inside GenLayer's nondeterministic execution.

SHA-256 commitments make reviewed bytes auditable. Stable URLs and archived/static sources are preferred; silent canonicalization was rejected because cross-validator normalization could diverge. Categorical consensus was chosen because irreversible settlement must not depend on free-form prose. `undetermined` is deliberate: inaccessible, changed, ambiguous, or insufficient evidence must not become a guessed truth value.

A five-minute challenge window gives readers a practical opportunity to submit committed context before adjudication. Up to three unique contexts are allowed, original submitters cannot add them, and challenger payout requires consensus to say committed context materially supported a misleading conclusion. Otherwise the bond is retained and recorded rather than paid to an arbitrary first submitter.
