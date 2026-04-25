// server.js — point d'entrée pour o2switch (Passenger / Application Node.js)
//
// Ce fichier est désigné comme "Application startup file" dans le Sélecteur Node.js.
// Il lance Next.js en mode production et écoute sur le port que Passenger fournit.

const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");

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
      console.log(`> Sion Émergence — Lettres en ligne sur le port ${port}`);
    });
  })
  .catch((err) => {
    console.error("Erreur au démarrage de Next.js :", err);
    process.exit(1);
  });
