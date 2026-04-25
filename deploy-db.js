// deploy-db.js — applique le schéma Prisma sur la base MySQL.
// Affiche des diagnostics clairs avant de lancer la commande, et capture
// les erreurs avec un message lisible (sans dump du code minifié de Prisma).

const { spawnSync } = require("node:child_process");

console.log("=== Sion Émergence — Déploiement BDD ===\n");

// 1. Vérifier que DATABASE_URL est présent et l'analyser
const url = process.env.DATABASE_URL || "";
if (!url) {
  console.error("✗ DATABASE_URL est vide. Vérifiez les Environment Variables.");
  process.exit(1);
}

// Masquer le mot de passe pour le log
const masked = url.replace(/:\/\/([^:]+):([^@]+)@/, (_, user) => `://${user}:****@`);
console.log("DATABASE_URL :", masked);

// Extraire les infos de connexion pour vérifier le format
const match = url.match(/^mysql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)$/);
if (!match) {
  console.error("✗ DATABASE_URL n'a pas le format mysql://USER:PASS@HOST:PORT/DBNAME");
  process.exit(1);
}
const [, user, , host, port, dbName] = match;
console.log("  utilisateur :", user);
console.log("  hôte        :", host);
console.log("  port        :", port);
console.log("  base        :", dbName);
console.log("");

// 2. Lancer prisma db push
console.log("→ Application du schéma…");
const result = spawnSync(
  "npx",
  ["prisma", "db", "push", "--accept-data-loss", "--skip-generate"],
  {
    cwd: __dirname,
    env: process.env,
    encoding: "utf8",
  },
);

if (result.stdout) console.log(result.stdout);

if (result.status === 0) {
  console.log("\n✓ Schéma appliqué avec succès.");
  process.exit(0);
}

// 3. Si erreur, extraire le message Prisma proprement
console.error("\n✗ Échec du déploiement.\n");
const stderr = result.stderr || "";

// Prisma émet ses erreurs lisibles entre des balises ou avec des codes P1XXX
const errorBlock = stderr.match(/Error:[\s\S]*?(?=\n\n|$)/);
const codeMatch = stderr.match(/(P\d{4}):\s*([^\n]+)/);

if (codeMatch) {
  console.error(`Code Prisma : ${codeMatch[1]}`);
  console.error(`Message     : ${codeMatch[2]}`);
} else if (errorBlock) {
  console.error(errorBlock[0].slice(0, 500));
} else {
  // Affiche les premières lignes de stderr en filtrant le code minifié
  const lines = stderr
    .split("\n")
    .filter((l) => !l.includes("var ") && !l.includes("=>{") && l.trim().length < 200)
    .slice(0, 20);
  console.error(lines.join("\n"));
}

process.exit(1);
