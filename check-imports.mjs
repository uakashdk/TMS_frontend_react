import fs from "fs";
import path from "path";

const EXTS = ["", ".js", ".jsx", ".ts", ".tsx", ".json", ".css"];
const problems = [];

const existsExact = (full) => {
  const parts = path.resolve(full).split(path.sep).filter(Boolean);
  let cur = path.sep;
  for (const part of parts) {
    let entries;
    try { entries = fs.readdirSync(cur); } catch { return false; }
    if (!entries.includes(part)) return false;
    cur = path.join(cur, part);
  }
  return true;
};

const isFile = (p) => existsExact(p) && fs.statSync(p).isFile();

const resolves = (base) =>
  EXTS.some((e) => isFile(base + e)) ||
  [".js", ".jsx"].some((e) => isFile(path.join(base, "index" + e)));

const hint = (base) => {
  const parts = path.resolve(base).split(path.sep).filter(Boolean);
  let cur = path.sep;
  for (const part of parts) {
    let entries;
    try { entries = fs.readdirSync(cur); } catch { return ""; }
    if (entries.includes(part)) { cur = path.join(cur, part); continue; }
    const stem = part.toLowerCase().replace(/\.(jsx?|tsx?)$/, "");
    const real = entries.find((e) => e.toLowerCase().startsWith(stem));
    return real ? `"${part}" ki jagah disk pe "${real}" hai` : `"${part}" nahi mila`;
  }
  return "";
};

const IMPORT_RE = /(?:from\s+|import\s*\(\s*|import\s+)["'](\.{1,2}\/[^"']+)["']/g;

const walk = (dir) => {
  for (const d of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, d.name);
    if (d.isDirectory()) walk(p);
    else if (/\.(jsx?|tsx?)$/.test(d.name)) {
      const src = fs.readFileSync(p, "utf8");
      for (const m of src.matchAll(IMPORT_RE)) {
        const base = path.resolve(path.dirname(p), m[1]);
        if (!resolves(base)) problems.push(`${p}\n   -> ${m[1]}\n   ${hint(base)}`);
      }
    }
  }
};

walk("src");
console.log(problems.length ? problems.join("\n") : "OK: koi case/missing import nahi mila");
console.log(`\nTotal problems: ${problems.length}`);
