# AI reflection worker

A Cloudflare Worker that receives a journal entry + mood and returns a
short AI-generated reflection using the Claude API. Exists so the
Anthropic API key never ships inside the mobile app.

## Local dev

```bash
npm install
npx wrangler secret put ANTHROPIC_API_KEY   # paste your key when prompted
npm run dev
```

## Deploy

```bash
npx wrangler deploy
```

Copy the resulting `*.workers.dev` URL into the app's `.env` as
`EXPO_PUBLIC_REFLECTION_API_URL` (see `../.env.example`).
