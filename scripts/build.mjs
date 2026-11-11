import * as esbuild from "esbuild";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const entry = path.join(root, "src/main.js");
const outfile = path.join(root, "js/app.bundle.js");

const watch = process.argv.includes("--watch");

const ctx = await esbuild.context({
  entryPoints: [entry],
  bundle: true,
  format: "iife",
  target: ["es2020"],
  outfile,
  logLevel: "info",
  sourcemap: false,
  legalComments: "none",
});

if (watch) {
  await ctx.watch();
  console.log("Watching src/ and js/ → js/app.bundle.js");
} else {
  const result = await ctx.rebuild();
  await ctx.dispose();
  if (result.errors.length) process.exit(1);
  console.log(`Built ${path.relative(root, outfile)}`);
}
