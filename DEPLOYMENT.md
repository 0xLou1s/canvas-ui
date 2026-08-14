# Deployment

The site is a static Next.js export (`output: "export"`) served by a Cloudflare
Worker. The Worker also hosts the only piece of server code: `POST /api/subscribe`,
which adds newsletter contacts to Resend.

## One-time setup

1. **Worker secrets** — these never live in a file:

   ```sh
   npx wrangler secret put RESEND_API_KEY
   npx wrangler secret put TURNSTILE_SECRET_KEY
   ```

2. **Turnstile widget** — create one in the Cloudflare dashboard with mode
   **Managed** and hostnames `canvasui.dev` + `www.canvasui.dev`. Put its *site*
   key in `.env.production.local`:

   ```sh
   NEXT_PUBLIC_TURNSTILE_SITE_KEY=0x4AAA...
   ```

   The secret key from the same widget goes to `wrangler secret put` (step 1).

3. **Local development** — `.env.local` holds the Cloudflare *test* site key and
   `.dev.vars` holds the test secret, so signups work on localhost without
   touching the real widget:

   | File | Loaded by | Holds |
   | --- | --- | --- |
   | `.env.local` | `next dev` | test site key |
   | `.env.production.local` | `next build` (deploy) | real site key |
   | `.dev.vars` | `wrangler dev` | test secret + Resend key |

   `.env.production.local` outranks `.env.local` in production builds, so the
   real key always wins on deploy and the test key never ships. All three are
   gitignored, and the preflight refuses to deploy a test key regardless.

   `npm run preview` does a production build, so it uses the *real* site key. Add
   `localhost` to the widget's hostname list if you want to exercise it there.

## Deploying

```sh
npm run deploy
```

This runs `npm run preflight` first, which fails the deploy if:

- `TURNSTILE_ENABLED="true"` but the site key is missing or is a Cloudflare test key
- `RESEND_API_KEY` (or `TURNSTILE_SECRET_KEY`, when required) is missing from the Worker

Use `npm run preview` to run the real Worker locally (`next build` + `wrangler dev`).
`npm run dev` serves the static site only — `/api/subscribe` does not exist there.

## Signup abuse controls

Configured in `wrangler.jsonc` and `worker/`:

| Control | Where | Behaviour |
| --- | --- | --- |
| Per-IP rate limit | `SUBSCRIBE_IP_LIMIT` | 5 requests / 60s, keyed on `cf-connecting-ip` |
| Global rate limit | `SUBSCRIBE_GLOBAL_LIMIT` | 60 requests / 60s |
| Turnstile | `TURNSTILE_ENABLED` var | When `"true"`, a valid token is mandatory and a missing secret returns 503 |
| Origin check | `ALLOWED_ORIGINS` var | Cross-origin `Origin` headers are rejected |
| Content type | Worker | Requires `application/json`, blocking preflight-free cross-origin POSTs |
| Honeypot | `subscribe_note` field | Non-empty means bot: the Worker returns a fake success |
| Domain filter | `worker/domains.ts` | Blocks disposable/example domains, suggests fixes for common typos |

Upstream Resend errors are never forwarded to the client.
