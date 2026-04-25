// server.js — point d'entrée pour o2switch (Passenger / Application Node.js)

console.log("[server.js] Démarrage…");
console.log("[server.js] Node :", process.version);
console.log("[server.js] CWD  :", __dirname);
console.log("[server.js] PORT :", process.env.PORT || "(non défini)");
console.log("[server.js] DATABASE_URL :", process.env.DATABASE_URL ? "OK" : "MANQUANT");

let createServer, parse, next;
try {
  ({ createServer } = require("http"));
  ({ parse } = require("url"));
  next = require("next");
  console.log("[server.js] Modules chargés ✓");
} catch (err) {
  console.error("[server.js] ✗ Échec du chargement des modules :", err);
  process.exit(1);
}

const port = parseInt(process.env.PORT || "3000", 10);
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev, dir: __dirname });
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    createServer((req, res) => {
      const parsedUrl = parse(req.url, true);
      handle(req, res, parsedUrl);
    }).listen(port, () => {
      console.log(`[server.js] Sion Émergence en ligne sur le port ${port}`);
    });
  })
  .catch((err) => {
    console.error("[server.js] ✗ Erreur au démarrage de Next.js :", err);
    process.exit(1);
  });
