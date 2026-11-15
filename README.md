# Shine Auto Repairs website

One-page website for Shine Auto Repairs, a mechanic at Unit 4B, 4 Homepride Avenue, Warwick Farm NSW. Built by AMBS Solutions from the client's Google listing, business card and their section picks from a five-concept gallery ("Your Mix").

Preview: `python3 -m http.server` in the repo root, then open http://localhost:8000. Live preview (noindex): https://shineauto.vercel.app

## Pages
- `index.html`: the site. Roller-door hero with the rego plate lookup and live open/closed status, warning lights ("What's that light on your dash?") with an Ask Shine box, services panel, "Servicing all makes" carousel, "Quality work guaranteed" photo card, the 3D "Walk around a pink slip" bay with the checklist, pink and blue slip fee cards, how a job goes, hours/address/rating bento, FAQ, call card, footer.
- `guides/`: Car guides hub and six SEO articles (pink vs blue slip, pink slip checklist, warning lights, LPG/diesel pink slips, logbook servicing, summer car check), sharing `guides/guides.css`. Facts cite nsw.gov.au and the TfNSW safety check standards.
- `privacy.html`, `404.html`

## Files
- `assets/inspect.js` + `assets/vendor/`: the 3D bay (three.js r160, loaded near the section only, photo fallback without WebGL)
- `assets/logo-mark.svg`: the Spanner S logo (also the favicon); `assets/logo-lockup.svg` for documents
- `assets/brands/`: official brand logo SVGs for the makes carousel (confirm logo use with Shine)
- `assets/img/`: AI illustrations as WebP (labelled on the page). Replace with real photos when supplied.
- `api/rego.mjs`: Vercel function for the plate lookup (switched off until a provider key is set; the page says "coming soon" meanwhile)
- `chat/`: the Ask Shine assistant (`chat.js`, `chat-index.json`). Edit answers in `chat/chat-config.json` (not published, see `.vercelignore`), then rebuild the index with the website-chat-bot skill's `build_chat_index.py --site <folder with index.html> --config chat/chat-config.json --out chat --base /chat/` and update the `?v=` on the script tag in `index.html`.
- `vercel.json`: main-only deploys, clean URLs, security headers, noindex until launch, and redirects from the old gallery links to `/`.

## Rego lookup (built, switched off)
- Recommended provider: Infinite Loop Reg Check (carregistrationapi.com.au), AUD 0.30 a lookup in blocks of 100, 10 free lookups to test. Confirm their terms allow a public website form.
- To switch on: in Vercel set `REGO_PROVIDER` (`regcheck` or `carsxe`), its key (`REGCHECK_USERNAME` or `CARSXE_KEY`) and `REGO_ALLOWED_ORIGINS` (the site's addresses). No code change needed.

## History
The concept gallery (Roller Door, Number Plate, Job Card, Dashboard, Pressed Metal), the section picker and the earlier pressed-metal site are in git history (branch `concept-gallery`).

## Things to finish before launch
- Everything in `CONTENT-NEEDED.md`: confirm hours, diesel pink slips and defect clearances, mobile pink slips, the makes list, inspection station number and prices; logo; an email for messages (the assistant's "Leave a message")
- Domain, then add canonical, og:url and sitemap.xml; remove `noindex` (meta tag, `X-Robots-Tag` in `vercel.json`, `robots.txt`)
- Set up the form/message endpoint and send a real test enquiry
- Share image and favicon from the real logo
- Run the Lighthouse speed check on the live site
