# AI Learning Website (Next.js + Tailwind)

A minimal, deploy-ready AI learning site with tabs (Learn / Playground / Quizzes / Datasets / About) and API routes for chat, text generation, and image classification.

## Local Dev
```bash
npm i
npm run dev
```

## Where to put your code
- `app/page.tsx` — UI + calls to `/api/*`
- `app/api/chat/route.ts` — handle chat messages (connect to your model)
- `app/api/generate/route.ts` — text generation endpoint
- `app/api/classify/route.ts` — image classification endpoint

Replace the demo logic with your own model calls (OpenAI, HuggingFace, FastAPI, etc.).

## Easiest Deployment: Vercel (1‑click)
1. Push this folder to a new GitHub repo.
2. Go to https://vercel.com/new and **Import Project**.
3. Framework preset: **Next.js**. Keep defaults. Click **Deploy**.
4. Your live URL will be created automatically.

Optional: create a `vercel.json` if you need custom headers or rewrites. Not required for this project.

## Environment Variables
If your APIs need secrets, add them in Vercel -> Project -> Settings -> Environment Variables. Then read via `process.env.MY_KEY` in server routes.

## Notes
- API routes are server-side. UI fetches `/api/*` relative to the app origin.
- TailwindCSS is installed and enabled through `app/globals.css` & `tailwind.config.ts`.
- No database is required to deploy this starter.
