# Content needed from Shine Auto Repairs

| Need | Goes in |
|---|---|
| 9 short phone clips of Balli doing each pink slip check (see FILMING.md) | Pink slip section, `assets/video/`, then list them in `CLIPS` in `assets/site.js` |
| 3 to 5 real five-star Google reviews to quote word for word (reviewer first name, month and year), with Shine's OK. Google hides review text from automated tools, so these must be copied by hand | Reviews card |
| Google currently shows 4.7 stars; the site quotes Birdeye's breakdown (53 of 57 five-star, 15 Nov 2026). Re-check before launch | Reviews card, chat |
| **Before launch (NSW):** Motor Vehicle Repairer Licence number (MVRL), to show as "Lic. No. MVRL…" in the footer. NSW Fair Trading: a repair business must hold a current licence | Footer |
| **Before launch (NSW):** confirm Shine is an Authorised Inspection Station for light vehicle pink slips, blue slips (AUVIS) and LPG (AGIS), as the site advertises all three | Services, fees, LPG guide |
| Do they service electric cars (Tesla, BYD)? Removed from the makes strip until confirmed | Makes strip, chat |
| Confirm the soft claims in the guides with Balli (e.g. common reasons cars fail) | Guides |
| If Shine gives customers a written warranty, it must include the ACL mandatory text (Competition and Consumer Regulations 2010, reg 90) | Paperwork, not the website |
| Confirm opening hours (only seen on an unclaimed directory listing) | `assets/content.js` hours, hero week strip, Hours table, JSON-LD |
| Vector logo, or permission to redraw the card's logo | Header, footer, favicon |
| Email address for enquiries (form stays hidden until set) | `assets/content.js` email |
| Form service (Web3Forms key), so messages arrive without opening the visitor's email | `assets/content.js` formEndpoint, web3formsKey |
| Confirm diesel pink slips and defect clearances (from Google's summary, not the card) | Services showcase, slip helper, FAQ |
| Authorised Inspection Station number, to show beside the slip prices | Pink and blue slips section |
| Confirm they charge the regulated maximum ($52 / $82), or their own lower price | Fees panel, FAQ |
| MTA NSW membership, if any | Trust line under the services |
| What "Quality work guaranteed" covers (period or kilometres), if they want it spelled out | Under the services list |
| 2 Google reviews to quote, with permission (reviewers mention honest pricing and no upselling) | `assets/content.js` testimonials |
| ABN | Footer |
| Real photos of the workshop, the team (Balli) and the sign out front, to replace the AI illustrations | Hero, services showcase (`assets/img/`), then remove the "AI illustration" labels |
| Domain name | canonical, og:url, sitemap.xml, robots.txt |
| Re-check the fees each 1 July (NSW updates them yearly) | Fees panel, FAQ, JSON-LD |
| Choose a rego lookup provider and pay for a key (Shine or AMBS account) | Vercel environment variables, then `regoLookup: true` in `assets/content.js` |
| Confirm the makes listed in the "Servicing all makes, including" carousel (Toyota, Mazda, Kia, Nissan, Volkswagen, BMW, Mercedes-Benz, Audi, Lexus, Volvo, Jeep, taken from a reference site) (shown as logos in the bottom strip; owner chose logos over plain names, with an "independent, not affiliated" line in the footer) | 06 Your Mix, MAKES list |
