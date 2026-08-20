import { readFileSync } from "node:fs";
const source = readFileSync("contracts/gsource.py", "utf8");
const required = ["accurate", "misleading", "not_found", "undetermined", "challenge_deadline", "protocol_retained", "prompt_comparative"];
const missing = required.filter((field) => !source.includes(field));
if (missing.length) throw new Error(`Contract schema is missing: ${missing.join(", ")}`);
console.log(`GSource schema verified (${required.length} invariants).`);
