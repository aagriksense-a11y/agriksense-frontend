// Flags Tailwind class lists where the same utility base appears twice with
// different values (one bare, one variant) — the bare one silently wins for
// every viewport, so a responsive override gets lost.
import { readFileSync } from "node:fs";
import { readdirSync } from "node:fs";
import { join } from "node:path";

const files = [];
(function walk(d) {
  for (const e of readdirSync(d, { withFileTypes: true })) {
    const p = join(d, e.name);
    if (e.isDirectory()) walk(p);
    else if (/\.tsx?$/.test(e.name)) files.push(p);
  }
})("src");

const base = (tok) => {
  const parts = tok.split(":");
  return parts[parts.length - 1];
};
const PREFIXES = [
  "gap-x", "gap-y", "space-x", "space-y", "max-w", "min-w", "max-h", "min-h", "grid-cols",
  "col-span", "translate-x", "translate-y", "rounded", "border", "items", "justify", "opacity",
  "shadow", "aspect", "inset", "leading", "tracking", "px", "py", "pt", "pr", "pb", "pl", "p",
  "mx", "my", "mt", "mr", "mb", "ml", "m", "gap", "text", "font", "w", "h", "size", "bg", "z",
  "top", "left", "right", "bottom", "order", "flex", "grid",
].sort((a, b) => b.length - a.length);

const isColor = (v) =>
  /^\/?\[?#/.test(v) || /^(white|black|ink|muted|green|lime|paper|line|night|panel|canvas|sidebar|transparent)/.test(v);

const keyOf = (tok) => {
  const b = base(tok);
  for (const p of PREFIXES) {
    if (b === p) return p === "flex" ? "display" : p;
    if (b.startsWith(p + "-")) {
      const val = b.slice(p.length + 1);
      if (p === "text") {
        if (/^(left|right|center|justify|start|end|wrap|nowrap|balance|pretty|capitalize|uppercase|lowercase)$/.test(val))
          return "text-align";
        return isColor(val) ? "text-color" : "text-size";
      }
      if (p === "bg") return isColor(val) ? "bg-color" : "bg-other";
      if (p === "border") {
        if (/^[tblrxy](-|$)/.test(val)) return "border-side-" + val[0];
        return isColor(val) ? "border-color" : "border-width";
      }
      if (p === "flex") return "flex-" + val.split("-")[0];
      // font-mono/sans/serif set font-family; the rest of the font-* scale sets
      // font-weight, so the two families of utility never actually collide.
      if (p === "font")
        return /^(?:mono|sans|serif)$/.test(val) || val.startsWith("[")
          ? "font-family"
          : "font-weight";
      return p;
    }
  }
  return null;
};

let hits = 0;
for (const f of files) {
  const text = readFileSync(f, "utf8");
  const lines = text.split("\n");
  lines.forEach((line, i) => {
    // only look inside string literals that look like class lists
    for (const lit of line.match(/"[^"\n]*"/g) || []) {
      const toks = lit
        .slice(1, -1)
        .split(/\s+/)
        .filter((t) => t && !t.startsWith("${"));
      const seen = new Map();
      toks.forEach((t, idx) => {
        const k = keyOf(t);
        if (!k) return;
        const bare = !t.includes(":");
        const value = base(t);
        const prev = seen.get(k);
        // A bare utility written after a variant of the same property cancels
        // the responsive override; two bare utilities of the same property are
        // resolved by stylesheet order, not author intent.
        if (prev && prev.value !== value && bare && (prev.bare || !prev.bare)) {
          console.log(
            `${f}:${i + 1}  ${k}:  bare "${t}" after "${prev.t}"`,
          );
          hits++;
        }
        seen.set(k, { t, bare, value, idx });
      });
    }
  });
}
console.log(`\nconflicting utility pairs: ${hits}`);
