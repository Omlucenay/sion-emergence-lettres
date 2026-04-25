// diagnose.js — vérifie l'environnement Node sur le serveur o2switch.
// À lancer via cPanel → Sélecteur Node.js → "Run JS Script" → "diagnose.js".
// Affiche tout ce dont on a besoin pour comprendre pourquoi l'app ne démarre pas.

const fs = require("node:fs");
const path = require("node:path");

console.log("=== Sion Émergence — Diagnostic ===");
console.log("Node version :", process.version);
console.log("Working dir  :", __dirname);
console.log("PORT env     :", process.env.PORT || "(non défini)");
console.log(
  "DATABASE_URL :",
  process.env.DATABASE_URL ? "défini ✓" : "MANQUANT ✗",
);
console.log(
  "ADMIN_PASSWORD :",
  process.env.ADMIN_PASSWORD ? "défini ✓" : "MANQUANT ✗",
);

const appRoot = __dirname;
const checks = [
  ["package.json", path.join(appRoot, "package.json")],
  [".next/", path.join(appRoot, ".next")],
  [".next/BUILD_ID", path.join(appRoot, ".next/BUILD_ID")],
  ["node_modules/", path.join(appRoot, "node_modules")],
  ["node_modules/next/", path.join(appRoot, "node_modules/next")],
  ["node_modules/@prisma/client/", path.join(appRoot, "node_modules/@prisma/client")],
  ["prisma/schema.prisma", path.join(appRoot, "prisma/schema.prisma")],
];

console.log("\n=== Présence des fichiers ===");
for (const [label, p] of checks) {
  try {
    const stat = fs.lstatSync(p);
    let kind = "fichier";
    if (stat.isSymbolicLink()) {
      kind = `lien symbolique → ${fs.readlinkSync(p)}`;
    } else if (stat.isDirectory()) {
      kind = "dossier";
    }
    console.log(`✓ ${label} (${kind})`);
  } catch {
    console.log(`✗ ${label} ABSENT`);
  }
}

console.log("\n=== Test de require('next') ===");
try {
  const nextPkg = require("next/package.json");
  console.log("✓ next chargé, version :", nextPkg.version);
} catch (err) {
  console.log("✗ require('next') a échoué :", err.message);
}

console.log("\n=== Test de require('@prisma/client') ===");
try {
  require("@prisma/client");
  console.log("✓ @prisma/client chargé");
} catch (err) {
  console.log("✗ require('@prisma/client') a échoué :", err.message);
}

console.log("\n=== Fin du diagnostic ===");
