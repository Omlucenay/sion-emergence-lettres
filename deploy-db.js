// deploy-db.js — applique le schéma Prisma sur la base MySQL.
// À lancer via cPanel → Sélecteur Node.js → "Run JS Script" → "deploy-db.js".
// Idempotent : ré-exécutable sans casser les données existantes.

const { execSync } = require("node:child_process");

console.log("→ Application du schéma Prisma sur la base de données…");

try {
  execSync("npx prisma db push --accept-data-loss --skip-generate", {
    stdio: "inherit",
    cwd: __dirname,
    env: process.env,
  });
  console.log("✓ Schéma appliqué.");
} catch (err) {
  console.error("✗ Échec :", err.message);
  process.exit(1);
}
