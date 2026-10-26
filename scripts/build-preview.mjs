// Builds the Claude artifact preview shell from index.html, so index.html stays the single source.
// The artifact host adds its own <!doctype>/<html>/<head>/<body>, so the shell is just
// title + stylesheet links + the markup between the SHELL markers.
// Run: node scripts/build-preview.mjs <output-file>
import { readFileSync, writeFileSync } from "node:fs";

const out = process.argv[2];
if (!out) { console.error("usage: node scripts/build-preview.mjs <output-file>"); process.exit(1); }

const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const title = html.match(/<title>.*?<\/title>/s)[0];
const links = (html.match(/<link [^>]+>/g) || []).join("\n");
const shell = html.match(/<!-- SHELL:START[^>]*-->([\s\S]*?)<!-- SHELL:END -->/)[1].trim();

writeFileSync(out, `${title}\n<meta name="claude:viewport-fit-sides" content="cover">\n${links}\n${shell}\n`);
console.log(`✓ wrote ${out}`);
