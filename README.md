# Shine Auto Repairs website

One-page website for Shine Auto Repairs, a mechanic at Unit 4B, 4 Homepride Avenue, Warwick Farm NSW. Built from their Google listing and business card.

Preview: `python3 -m http.server` in the repo root, then open http://localhost:8000.

## Pages
- `index.html`: hero (AI photo, chrome headline, live status, week keys), ticker, services showcase (7 AI photos), "Walk around a pink slip" 3D bay, "Pink slip, blue slip or neither?" helper with the NSW fees, how a job goes (sticky plates), rating, FAQ, hours and address, enquiry form (hidden until an email is supplied), call band
- `privacy.html`, `404.html`

## Files
- `assets/content.js`: business facts, hours and reviews (one source)
- `assets/page.js`: menu, live open/closed status in Sydney time, today's hours, phone quick bar, services showcase, slip helper, FAQ folds, click-to-load map
- `assets/fonts/`: self-hosted Archivo and IBM Plex Sans
- `assets/inspect.js`: the 3D inspection bay (three.js r160 in `assets/vendor/`, loaded only near the section, paused off-screen, photo fallback without WebGL)
- `assets/img/`: AI illustrations as WebP (`-640`/`-1200`, hero `-800`/`-1536`)
- `assets/site.js`: AMBS starter (hide-if-missing, enquiry form, reveals)
- `assets/site.css`: styles
- `BRIEF.md`, `CONTENT-NEEDED.md`, `CLAUDE.md`

## Concept gallery and section mix (review stage)
- `/` is the concept gallery (`index.html`): five homepage concepts in `designs/NN-slug/`, with the floating switcher `assets/concepts.js`. Short links: /roller-door, /plate, /job-card, /dashboard, /pressed-metal.
- `/mix` (`mix.html`): pick the best version of each section, plus the overall look, then send the mix to AMBS or copy a link. Sections and where each design keeps them live in `assets/mix-data.js`; thumbnails come from `node tools/section-thumbs.mjs`.
- The previous live design is concept 05 (`designs/05-pressed-metal/`). Once a mix is chosen, the hybrid becomes the site at `/` and the gallery is removed.

## Rego lookup (built, switched off)
Customers type their plate and the site shows the make, model and year (and the rego due date for states that provide it; NSW drivers get a link to Service NSW's free check), then answers the pink or blue slip questions for them.
- `api/rego.mjs`: Vercel function that calls the provider, so the key stays secret. It returns only the car's description (no VIN or owner details), stores nothing, limits repeat lookups and checks the request comes from this site.
- Recommended provider: Infinite Loop Reg Check (carregistrationapi.com.au), AUD 0.30 a lookup in blocks of 100, 10 free lookups to test. Confirm with them that their terms allow a public website form.
- To switch on: in Vercel, set `REGO_PROVIDER` (`regcheck` or `carsxe`) and its key (`REGCHECK_USERNAME` or `CARSXE_KEY`), plus `REGO_ALLOWED_ORIGINS` (the site's addresses). Then set `regoLookup: true` in `assets/content.js`.
- The privacy page already explains the lookup.

## Things to finish before launch
- Everything in `CONTENT-NEEDED.md`, first of all confirming the hours
- Remove `noindex` (the meta tags, `X-Robots-Tag` in `vercel.json` and `robots.txt`)
- Domain, then add canonical, og:url and sitemap.xml; set robots.txt to allow; remove the `noindex` meta tags
- Set up the form endpoint and send a real test enquiry
- Share image and a favicon from the real logo
- Run the Lighthouse speed check on the live site (preview, 15 Nov 2026: phone 97 / 100 / 100, laptop 100 / 100 / 100 for performance, accessibility, best practices; first load 261 KB on phones; SEO 66 only because of noindex)
