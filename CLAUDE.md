# Shine Auto Repairs website: notes for Claude

Built by AMBS Solutions. Follow the **ambs-website-design** skill (and **website-chat-bot** if this site has the chat). These are the house rules that matter most for this owner.

## Working style
- Work locally and show screenshots or a short video first. Publish to the live site only when the owner says "push live".
- Never lose a working feature when changing things (form leads, booking, phone links). Start from the latest live version.
- Deploy only `main`.

## Design rules the owner always checks
- Everything fits the screen: 390×844 phones and 1280×720 / 1366×768 / 1440×900 / 1536×864 laptops. No overlapping text, and the hero fits the first screen.
- Centre-align section headings, intros, the hero, the footer and menus. Keep tick lists, FAQs, timelines and forms left-aligned.
- One type scale across all pages, with calm, readable fonts.
- Real logo (vector), and all accent colours taken from the logo. No glow, haloes, highlighter bands or white outer shadows.
- Native motion only: CSS sticky stacking cards (opaque, heading pinned, each card's number and title showing), slow smooth opens (~1.4s), no scroll-jacking or JS pinning, no count-ups, tilt or zoom. Respect reduced motion.
- Declutter: one headline and one main action in the hero; few cards, chips and arrows.
- Doesn't look AI-generated: plain Australian English (this client is in NSW), no em dashes, no exclamation marks, no hype words, no "X. One Y." headings, no eyebrow on every section.
- Real, sharp, uncropped photos (WebP with srcset). Smooth on phones: no live backdrop-blur.
- Header stays visible while scrolling. On phones and tablets, Call / Directions and the Chat button sit together at the bottom; they appear as soon as the drive-in car parks (owner asked for this, overriding the old "hide while the hero shows").
- Dark mode (if offered) built properly, including menus and overlays. It never switches by time of day.
- Forms really send. Contact details live in one place. Never invent facts: hide what the client hasn't supplied (`CONTENT-NEEDED.md`).
- Footer credit: "Proudly designed by AMBS Solutions".

## This site
- Design: "Your Mix", modernised. The client picked sections from a five-concept gallery, then asked for a modern, interactive feel like the AMBS site. Dark cinematic roller-door hero with the rego plate lookup; everything below is light and airy: Inter Tight + Inter, white rounded cards, soft shadows, pill buttons, Shine orange #f39a36 (deeper #c4700f/#9a5208 for text on light), red only for warning lights.
- Signature pieces: roller door intro with the SUV drive-in that turns into the chat button, rego plate lookup, warning-lights panel (ring timer), Delta-style live pink slip diagram (SVG in index.html, steps in `assets/site.js`; real clips can be added, see FILMING.md), Google reviews carousel, Ask Shine assistant (`chat/`). Page script lives in `assets/site.js` (bump `?v=`).
- Photos are AI illustrations, labelled on the page. Swap for real photos when supplied.
- NSW fees and rules are sourced from nsw.gov.au and dated. Re-check every 1 July.
- Warning-light wording was safety-reviewed: change it only with care, in the page and in `chat/chat-config.json` together.
- Stack: static HTML (one self-contained `index.html`), no build step. Preview with `python3 -m http.server` in the repo root.
- Facts live in `index.html` (hours appear in the hero status script, the hours card, the FAQ and the JSON-LD; rating is Google 4.7 from 64 as at 15 Nov 2026 in the reviews section, guides and chat; the hero badge shows Birdeye's 93% five-star (53 of 57), linked to Birdeye, because Google hides its star breakdown) and in `chat/chat-config.json` for the assistant: change both together, then rebuild the chat index.
- Rego lookup: `api/rego.mjs`, switched on by Vercel env vars (see README).
- Languages: English (Australia), `lang="en-AU"`. Phones shown as (02) 8798 5715, linked as tel:+61287985715.
- Things to finish before launch: see README.md
