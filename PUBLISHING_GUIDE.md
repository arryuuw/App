# Publishing "Reflect" — a plain-language guide

This app is code-complete for a first version. Everything below is stuff
**only you** can do, because it requires your own accounts, your own
business identity, and your own money (a few small, one-time/annual fees).
No coding required for any of these steps — just following instructions
and clicking buttons.

## What you're launching

**Reflect** is an AI journaling app: you write a journal entry, pick a
mood, and get back a short AI-generated reflection plus a follow-up
question. Entries are stored only on the user's phone (nothing on a
server), which is both a genuine privacy feature to market and the reason
there's no user-account system to build.

---

## Step 1 — Get your own AI access (10 min, ~$5-20/month to start)

The app needs an Anthropic (Claude) API key so it can generate reflections.

1. Go to [console.anthropic.com](https://console.anthropic.com) and create
   an account.
2. Add a small amount of billing credit (e.g. $10) under "Billing."
3. Create an API key under "API Keys." Copy it somewhere safe — you'll
   paste it once in Step 2 and never need it again after that.

This is a pay-as-you-go cost: each reflection costs a fraction of a cent.
At real usage volumes, budget a few cents per active user per month.

## Step 2 — Deploy the AI backend (15 min, free tier is enough at first)

The app never talks to Anthropic directly — it talks to a small piece of
code (in the `/worker` folder) that I already wrote for you, which is the
thing that actually calls Claude. This keeps your API key private (never
exposed inside the app itself, which anyone could otherwise inspect).

1. Create a free account at [dash.cloudflare.com](https://dash.cloudflare.com).
2. Send me (or the next Claude Code session) the message: **"deploy the
   worker to my Cloudflare account"** — I'll need you to run two commands
   from a terminal and paste the output back, or I can do it directly if
   you give this session access to your Cloudflare account.
3. When it's deployed, you'll get a URL like
   `https://journal-ai-reflection.<you>.workers.dev`. That's your backend.
4. Set your Anthropic key as a secret (not in code): from the `/worker`
   folder, run `npx wrangler secret put ANTHROPIC_API_KEY` and paste the
   key from Step 1 when prompted.

## Step 3 — Connect the app to your backend (2 min)

1. Copy `.env.example` to a new file named `.env`.
2. Paste your Worker URL from Step 2 into it.
3. That's it — the app now calls your AI backend.

## Step 4 — Decide on pricing (your call, no deadline)

The Settings screen has a placeholder "Upgrade — $4.99/mo" button that
isn't wired to real payments yet. Before launch, decide:

- **Free tier**: unlimited journaling, limited AI reflections/week (already
  the suggested framing in the UI copy).
- **Paid tier**: unlimited AI reflections, mood trend insights, etc.

To actually take payment, the app needs **RevenueCat** (free up to
$2.5k/month revenue) wired to Apple/Google's in-app purchase systems —
this is a real integration step I can do once you've set up Steps 1-3
and have App Store Connect / Play Console accounts (Steps 5-6), since
in-app purchase products must be created in those consoles first.

## Step 5 — Apple Developer account (for iOS App Store) — $99/year

1. Go to [developer.apple.com/programs](https://developer.apple.com/programs)
   and enroll (needs a legal name/business, a credit card, and 24-48h for
   Apple to approve you if enrolling as an individual).
2. You do **not** need a Mac yourself — I can build and submit the iOS app
   for you using Expo's cloud build service (EAS), which builds real iOS
   apps in the cloud even without Apple hardware.

## Step 6 — Google Play Developer account (for Android/Google Play) — $25 one-time

1. Go to [play.google.com/console/signup](https://play.google.com/console/signup)
   and pay the one-time $25 fee.
2. Same as iOS — I can build and submit the Android app via EAS without
   you needing any local Android setup.

## Step 7 — Build and submit (once accounts exist)

Once you have both developer accounts, come back and say **"build and
submit the app"** — I'll:
1. Set up EAS (Expo's build service — free tier covers early submissions).
2. Generate the required app icons/screenshots.
3. Produce the iOS `.ipa` and Android `.aab` build files.
4. Walk you through the App Store Connect / Play Console listing forms
   (title, description, screenshots, privacy policy URL, age rating).

**A real privacy policy is required by both stores.** Since this app
stores data only on-device and calls an AI API, this is a short,
templatable page — I can draft it once you tell me your business/legal
name, but you (or a lawyer, if you want to be careful) should be the one
to actually publish and stand behind it.

## Step 8 — After launch

The single biggest driver of "does this make money" is **distribution**,
not code: TikTok/Instagram/Reddit posts about your own journaling
experience with the app, App Store Optimization (title/keywords/screenshots),
and word of mouth. That part is entirely on you — it's the sales skill
you already have, aimed at a different kind of customer.

---

## Realistic expectations

Most solo-built apps make $0-very little. A small minority make real
money, usually because of consistent marketing over months, not because
of a clever feature. Treat the first version as a way to test whether
*anyone* wants this before investing more time — ship it, tell 20 people,
see if they come back the next day.
