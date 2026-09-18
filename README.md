# Reflect — AI journaling app

A cross-platform (iOS + Android) journaling app built with Expo/React
Native. Write a daily entry, pick a mood, get a short AI-generated
reflection and follow-up prompt back. Entries are stored only on-device
(AsyncStorage) — no user accounts, no server-side data.

## Structure

- `App.tsx` — navigation root
- `src/screens/` — Home (entry list + streak), New Entry, Entry Detail, Settings
- `src/storage/entries.ts` — local persistence + streak calculation
- `src/api/reflection.ts` — client for the AI backend
- `worker/` — Cloudflare Worker that proxies journal text to the Claude API
  (keeps the Anthropic API key off the device)

## Running locally

```bash
npm install
npx expo start
```

Scan the QR code with the Expo Go app on your phone, or press `i`/`a` for
a simulator if you have Xcode/Android Studio installed.

AI reflections require a deployed backend — see `worker/README.md` and
`.env.example`. Without it, entries still save; the app just skips the
reflection instead of erroring.

## Publishing to the App Store / Play Store

See `PUBLISHING_GUIDE.md` — it's written for a non-technical reader and
covers exactly what accounts/steps are needed (Anthropic API key,
Cloudflare account, Apple Developer, Google Play Console).
