// build.js — compile Next.js en production.
// À lancer via cPanel → Sélecteur Node.js → "Run JS Script" → "build.js".
// Sépare le build de l'installation pour pouvoir diagnostiquer chaque étape.

const { execSync } = require("node:child_process");

console.log("→ Compilation Next.js (next build)…");

try {
  execSync("npx next build", {
    stdio: "inherit",
    cwd: __dirname,
    env: process.env,
  });
  console.log("✓ Build terminé.");
} catch (err) {
  console.error("✗ Build échoué :", err.message);
  process.exit(1);
}
