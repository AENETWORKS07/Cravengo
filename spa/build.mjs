/**
 * Builds the whole app into one HTML file for places that cannot run a
 * Next.js server: a pitch on someone else's laptop, an email, an artifact.
 * Same components, same state, an in-page router instead of Next's.
 *
 *   npm run demo   ->  dist/crave-club.html
 */
import { build } from "esbuild";
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
mkdirSync(dist, { recursive: true });

const js = await build({
  entryPoints: [path.join(root, "spa/main.tsx")],
  bundle: true,
  minify: true,
  format: "iife",
  target: ["es2020"],
  jsx: "automatic",
  write: false,
  define: { "process.env.NODE_ENV": '"production"' },
  alias: {
    "next/link": path.join(root, "spa/shims/link.tsx"),
    "next/navigation": path.join(root, "spa/shims/navigation.ts"),
  },
  tsconfig: path.join(root, "tsconfig.json"),
  logLevel: "warning",
});

execFileSync("npx", ["@tailwindcss/cli", "-i", "app/globals.css", "-o", path.join(dist, "app.css"), "--minify"], { cwd: root, stdio: "inherit" });
const css = readFileSync(path.join(dist, "app.css"), "utf8");
const script = js.outputFiles[0].text.replace(/<\/script/gi, "<\\/script");

const html = `<title>Crave Club</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@400;500;600;700&family=Geist+Mono&display=swap">
<style>
:root{--font-syne:'Syne';--font-dm-sans:'DM Sans';--font-geist-mono:'Geist Mono';color-scheme:dark}
html,body{height:100%}
body{font-family:var(--font-dm-sans),system-ui,sans-serif}
#crave-root{min-height:100%}
${css}
</style>
<div id="crave-root"></div>
<script>${script}</script>
`;
writeFileSync(path.join(dist, "crave-club.html"), html);
console.log(`dist/crave-club.html  ${(Buffer.byteLength(html) / 1024).toFixed(0)} KB`);
