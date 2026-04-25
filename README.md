# Sion Émergence — Lettres d'intention en ligne

Application web qui permet aux parents et partenaires de remplir, signer
électroniquement et transmettre une lettre d'intention au tiers-lieu Sion Émergence
(Le Lamentin, Martinique). Génère trois types de lettres :

- **Sion Academy** — école primaire, parents
- **Joy Club** — périscolaire & loisirs, parents
- **Partenaire** — 3 variantes (institutionnel / professionnel / acteur économique)

---

## Démarrage local

```bash
npm install
cp .env.example .env       # déjà fait au scaffold — adapter si besoin
npx prisma db push          # crée dev.db (SQLite)
npm run dev                 # http://localhost:3000
```

Aucun envoi d'email réel n'est fait tant que `SMTP_HOST` est vide :
les emails sont **affichés dans la console** (mode dev). Le PDF est tout de même
généré et archivé dans `storage/uploads/`.

### Espace admin

`http://localhost:3000/admin` — protégé par Basic Auth :
- utilisateur : `admin`
- mot de passe : valeur de `ADMIN_PASSWORD` dans `.env` (défaut `changeme`)

---

## Architecture

```
src/
├── app/
│   ├── page.tsx                         choix du type de lettre
│   ├── academy/                         formulaire école primaire
│   ├── joy-club/                        formulaire périscolaire
│   ├── partenaire/                      formulaire partenaire (3 variantes)
│   ├── signature/[id]/                  signature manuscrite
│   ├── confirmation/[id]/               confirmation + téléchargement
│   ├── admin/                           liste + filtres
│   └── api/
│       ├── submit/                      POST formulaire
│       ├── pdf/[id]/preview             aperçu PDF non-signé
│       ├── pdf/[id]/                    PDF signé
│       ├── sign/[id]/                   POST signature → email + archive
│       └── admin/export.csv             export CSV
├── components/
│   ├── form-bits.tsx                    Input, Textarea, ConsentBlock…
│   ├── signature-pad.tsx                canvas signature_pad
│   └── site-frame.tsx                   header/footer
├── lib/
│   ├── db.ts                            Prisma client
│   ├── email.ts                         nodemailer (SMTP) ou mock dev
│   ├── schemas.ts                       Zod (validation client + serveur)
│   └── pdf/
│       ├── academy.tsx                  template PDF Academy
│       ├── joy-club.tsx                 template PDF Joy Club
│       ├── partner.tsx                  template PDF Partenaire (3 variantes)
│       ├── components.tsx               header / signature block / RGPD
│       ├── styles.ts                    palette + StyleSheet
│       └── render.ts                    renderToBuffer
├── proxy.ts                             Basic Auth /admin (Next.js 16 proxy)
└── middleware-style…
prisma/
└── schema.prisma                        modèle Submission
storage/uploads/                         PDF signés archivés sur disque
```

---

## Signature électronique

Niveau **simple eIDAS** (suffisant pour des lettres d'intention) :

- tracé manuscrit via `signature_pad` (canvas)
- horodatage serveur (`signedAt`)
- IP + user-agent du signataire enregistrés
- empreinte SHA-256 du PDF signé stockée
- consentements RGPD + acceptation des termes obligatoires
- PDF archivé sur disque + envoyé par email aux deux parties

Cohérent avec les articles 1366-1367 du Code civil et le règlement eIDAS.

---

## Déploiement sur o2switch

### 1. Créer la base MySQL

Dans cPanel → **MySQL Databases** : créez `sion_lettres` + un utilisateur dédié.

Notez l'URL au format :
```
DATABASE_URL="mysql://USER:MOT_DE_PASSE@localhost:3306/sion_lettres"
```

### 2. Adapter `prisma/schema.prisma`

```prisma
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}
```

### 3. Variables d'environnement

Sur o2switch (cPanel → Application Node.js → Environment Variables) ajoutez :

| Variable | Valeur |
|---|---|
| `DATABASE_URL` | `mysql://…` (point 1) |
| `SMTP_HOST` | `smtp.o2switch.net` |
| `SMTP_PORT` | `587` |
| `SMTP_USER` | adresse mail créée dans cPanel |
| `SMTP_PASSWORD` | mot de passe de la boîte mail |
| `SMTP_FROM` | `Sion Émergence <noreply@votre-domaine.fr>` |
| `NOTIFICATION_EMAIL` | `om.lucenay@gmail.com` |
| `ADMIN_PASSWORD` | mot de passe fort pour `/admin` |
| `PUBLIC_URL` | `https://lettres.votre-domaine.fr` |

### 4. Build + upload

En local :
```bash
npm run build              # output: standalone
```

Uploadez (FTP / SSH) **uniquement** :
- `.next/standalone/` → racine de l'app
- `.next/static/` → dans `.next/standalone/.next/static/`
- `public/` → dans `.next/standalone/public/`
- `prisma/` (schéma + migrations)
- `package.json`, `node_modules` (ou installer côté serveur via `npm ci`)

### 5. Configuration cPanel

cPanel → **Setup Node.js App** :
- Application root : dossier où vous avez uploadé
- Application URL : votre sous-domaine
- Application startup file : `server.js` (créé par standalone)
- Node.js version : 22.x

Cliquer **Run NPM Install**, puis **Restart**.

### 6. Migration Prisma sur le serveur

Via SSH :
```bash
cd ~/votre-app
npx prisma migrate deploy
mkdir -p storage/uploads
chmod 700 storage/uploads
```

### 7. Sauvegardes

- la base MySQL est sauvegardée par o2switch (rétention 30 jours)
- pour `storage/uploads/` (PDF signés), planifier un cron de rsync hebdomadaire vers un autre dossier ou un drive externe

---

## Limites connues

- Le rendu Joy Club avec une table à 5 colonnes peut passer sur 2 pages selon le navigateur. Acceptable pour un prototype — peut être affiné en réduisant la police ou en réorganisant la table en 2 sous-blocs.
- Le mode dev SQLite ne supporte pas les migrations multiples. Pour la prod, utilisez `prisma migrate dev` (en local) puis `prisma migrate deploy` (sur o2switch).

---

## Roadmap (post-MVP)

- Branding final (logo, fontes Sion Émergence)
- Renvoi automatique de la lettre signée si l'email initial échoue
- Page publique de vérification d'une lettre par référence + hash
- Bascule signature qualifiée Yousign si besoin pour les partenaires institutionnels
