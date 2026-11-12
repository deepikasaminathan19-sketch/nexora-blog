# NEXORA: EXPLORE. LEARN. INNOVATE.
MERN technology blog. React + Vite (client) and Express + MongoDB (server).

## Run locally
```bash
cd server && cp .env.example .env     # fill MONGO_URI, JWT_SECRET, ADMIN_*, CLOUDINARY_*
npm install && npm run seed && npm run dev    # API on :5000
cd ../client && cp .env.example .env && npm install && npm run dev   # site on :5173
```
Admin login: `http://localhost:5173/admin/login` with the ADMIN_EMAIL / ADMIN_PASSWORD from `server/.env`.

## How it fits together
Browser (React) → `services/api.js` (fetch, adds the JWT) → Express routes → Mongoose models → MongoDB Atlas.
- **Public API** (`routes/public.js`): only returns blogs where `status=published` and `publishedAt <= now`.
- **Admin API** (`routes/admin.js`): `router.use(requireAdmin)` verifies the JWT on every route, so protection lives in the backend, not just React.
- **Auth**: `POST /api/auth/login` checks the bcrypt hash and returns a 1-day JWT. There is no register route; `npm run seed` creates the admin.
- **Scheduled publishing**: `server.js` runs a `node-cron` job every minute that turns due `scheduled` posts into `published`.
- **Reading time**: computed in the Blog model before save (words / 200, rounded up, min 1). Cards show only a clock icon and "8 min".
- **Related posts**: same category, ranked by shared tags. **Popular posts**: sorted by `views`.
- **Comments**: saved with `approved:false`; public API returns only approved ones and never the email.
- **Images**: Multer keeps the file in memory, then streams it to Cloudinary.

## API summary
Public: `GET /api/blogs?page&sort&category&q`, `/blogs/popular`, `/blogs/:slug`, `/blogs/:slug/comments` (GET, POST), `/blogs/:slug/helpful`, `/categories`, `/authors`, `POST /newsletter`, `/sitemap.xml`, `/robots.txt`.
Admin (Bearer token): `/api/admin/blogs`, `/categories`, `/tags`, `/authors` (CRUD), `/comments` (list, approve, delete), `/upload`, `/stats`, `/subscribers`.

## Deploy
- **Database**: MongoDB Atlas, allow Render's IPs (or 0.0.0.0/0 while testing), copy the connection string to `MONGO_URI`.
- **Backend on Render**: root `server`, build `npm install`, start `npm start`, add every variable from `server/.env.example`. Set `CLIENT_URL` and `SITE_URL` to the Vercel URL. Run `npm run seed` once from the Render shell.
- **Frontend on Vercel**: root `client`, framework Vite, env `VITE_API_URL=https://<render-app>.onrender.com/api`. `vercel.json` handles React Router refreshes.
- Never commit `.env`. Rotate any secret that leaks.
