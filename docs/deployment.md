# Deployment

## Platform: Vercel

Next.js 16 (App Router, SSR) — Vercel auto-detects the framework. **No `vercel.json`**
(the SPA-style config would break Next.js SSR).

## URL
- Production: https://my-app-nu-seven-34.vercel.app
- Project: `trandha/my-app` (Vercel scope `trandha`)
- Inspect: https://vercel.com/trandha/my-app

## Deploy Command
```bash
vercel --prod --yes    # production (project already linked via .vercel/)
vercel                 # preview
```
First-time link (multi-remote repo): `printf '\n' | vercel link --yes` (selects `origin`).

## Environment Variables (Production, set in Vercel)
Client-only Supabase auth → these `NEXT_PUBLIC_*` vars are **build-time** (inlined), required:
- `NEXT_PUBLIC_SUPABASE_URL` — hosted Supabase (`iwxvaneefsukzvbrgltr.supabase.co`)
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_EVENT_DATETIME` — ISO-8601 event start for the homepage countdown

Set via: `grep '^NAME=' .env.local | cut -d= -f2- | vercel env add NAME production`.
Re-add + redeploy after changing any of them (build-time inlining).

## Post-deploy TODO (Google OAuth)
Login round-trip will NOT complete until the Vercel domain is allow-listed:
1. Supabase → Auth → URL Configuration: add `https://my-app-nu-seven-34.vercel.app` to redirect allow-list.
2. Google Cloud → OAuth credentials: add the Supabase callback + Vercel origin to authorized redirect URIs.
3. Enable the Google provider on the hosted Supabase project (see login plan — `400 Unsupported provider` otherwise).

The rest of the app (client auth guard, countdown, i18n VN/EN, pages, global background) works without this.

## Notes
- Vercel **Hobby tier is personal-use only**; this is a Sun* project → commercial use needs Pro.
- The bare deployment URL (`my-o7yzjut3d-trandha.vercel.app`) 302s under deployment protection; use the production alias above.

## Rollback
```bash
vercel rollback [previous-deployment-url]
vercel ls          # list deployments
```
