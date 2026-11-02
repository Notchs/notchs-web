# SEO_PLAN.md: Notchs (www.notchs.com)

The page-by-page SEO spec for this repo. **`CLAUDE.md` comes first.** Coding standards,
security, privacy, the team lock and the git workflow all live there. If anything here
conflicts with `CLAUDE.md`, `CLAUDE.md` wins, and you should say so in your PR.

## 0. Rules (never break them)

1. **Only real things.** No fake counters, reviews or "X cafés joined", and no
   `aggregateRating`. The promise is "If it's on Notchs, it really happened".
2. **Never index an empty page.** City, category and venue pages stay `noindex` until they
   have real data (thresholds in §4).
3. **Never index private pages.** The passport app, venue app, admin, counter screen,
   shared cards, login pages and team pages are always `noindex` and are never in the
   sitemap.
4. **Don't change product copy, form fields or consent text** in an SEO task. If copy looks
   wrong, list it in the PR and leave it.
5. No bill or bill-upload wording. Never use "FOMO" or "Wrapped"; say "unnotched" and
   "Notch Card". Founders are not named.
6. **Small and clean.** Use the Next.js 16 App Router Metadata API (`metadata`,
   `generateMetadata`, `app/robots.ts`, `app/sitemap.ts`, image files). No SEO npm
   packages. Use the shared helpers; don't repeat code.
7. **Explain every SEO change in very easy English** in the PR description. Some
   teammates find English hard.

## 1. Site-wide setup

| Item | Rule | Status (24 Oct 2026) |
|---|---|---|
| Address | The only address is `https://www.notchs.com` (`siteConfig.url`, from `NEXT_PUBLIC_APP_URL`). `notchs.com`, `http://` and `notchs-web.netlify.app` all 301 to it. | Done |
| Canonical | Every page sets `alternates.canonical` to a **relative path**. `metadataBase` makes it absolute and drops the query, so `?ref=ig` never makes a duplicate page. | Done |
| Shared metadata | `openGraphBase` in `src/shared/lib/metadata.ts`: type `website`, siteName `Notchs`, locale `en_IN`. Spread it on every page. | Done |
| Language | `<html lang="en-IN">` | Done |
| Title template | `%s · Notchs` (root layout) | Done |
| Twitter card | `summary_large_image` (comes from `twitter-image.png`) | Done |
| Icons and manifest | `icon.svg`, `apple-icon.png`, `app/manifest.ts`. Use existing brand files; never draw a new logo. | Done |
| Structured data | Homepage only: schema.org `Organization` (name, url, logo, email, `sameAs` Instagram, YouTube, LinkedIn) + `WebSite`. Never `SearchAction`, a founder `Person`, `aggregateRating` or `Review`. | Done (PR #17) |
| robots.txt | `app/robots.ts`: allow `/`, disallow `/api/`, list the sitemap. Private pages use **`noindex`, not Disallow**, so crawlers can actually read the noindex. | Done |
| sitemap.xml | `app/sitemap.ts`: only pages that are live for everyone and indexable. City, category and venue pages come from the API, only when it says `is_indexable`. | Done (homepage only for now) |
| Default OG image | `app/opengraph-image.png` (1200×630). Keep text inside the centre 1000×500, because WhatsApp crops the edges. | Done (static image) |
| Other hosts | Any app on its own host (e.g. `admin.`): `noindex` on every page. | Admin pages are noindex |

## 2. Page by page

Titles: 60 characters max, before " · Notchs". Descriptions: 120–155 characters. One `h1` per
page. **If a page doesn't exist yet, skip it and say so; never create pages in an SEO
task.**

| Route | Index? | Title | Meta description | h1 | Schema |
|---|---|---|---|---|---|
| `/` | Yes | Notchs · Ahmedabad's real-life leaderboard *(set as absolute)* | Scan the QR at the counter, send one WhatsApp message, get Notched. Ahmedabad's real-life leaderboard, ranked by the places you actually go. | (keep the current hero) | Organization, WebSite |
| `/join` | Yes | Join the waitlist | Request your Notchs invite. Invites go out in waves, starting with the Founding 500. No app, just WhatsApp. | Request your invite | — |
| `/how-it-works` | Yes | How it works | Scan the QR at the counter, press send on WhatsApp, and your visit becomes a Notch. No app, no password, no forms. | How Notchs works | — |
| `/venues` | Yes | For cafés, restaurants and turfs | Pay for customers, not clicks. See how many new and returning customers you really get. Zero extra work for your staff. | Pay for customers, not clicks. | — |
| `/trust` | Yes | Trust: how we verify visits | If it's on Notchs, it really happened. How visits are verified, what venues can see, and why rankings are never for sale. | If it's on Notchs, it really happened. | — |
| `/about` | Yes | About Notchs | Notchs is the proof layer of real life. Built by a small team from Ahmedabad and Bengaluru. | Real life, ranked. | — |
| `/faq` | Yes | FAQ | Answers about Notchs for people who go out and for venues: how it works, what's free, privacy and how to delete your data. | Questions, answered | FAQPage (only real Q&As shown on the page) |
| `/privacy` | Yes | Privacy notice | What Notchs keeps, what we never do, what venues can see (totals, never phone numbers), and how to delete everything. | Privacy notice | — |
| `/terms` | Yes | Terms | The rules for using Notchs: one Notch per place per day, fair use, and rankings that are never for sale. | Terms | — |
| `/ahmedabad` | After §4 threshold | Ahmedabad's real-life leaderboard | The best cafés, restaurants and turfs in Ahmedabad, ranked by real verified visits. Updated every Monday. | Ahmedabad's real-life leaderboard | — |
| `/ahmedabad/cafes` (+ `/restaurants`, `/bars`, `/turfs`, `/run-clubs`) | After §4 threshold | Best cafés in Ahmedabad, ranked by real visits | Ahmedabad cafés ranked by verified visits this week, not fake reviews or paid ads. Updated every Monday. | Best cafés in Ahmedabad, ranked by real visits | ItemList (name + url only) |
| `/ahmedabad/v/[slug]` | After §4 threshold | [Venue], [Area]: hours and how to Notch | [Venue] in [Area], Ahmedabad. Open [hours]. Scan the QR at the counter to Notch your visit. | [Venue] | LocalBusiness subtype (CafeOrCoffeeShop, Restaurant, BarOrPub, SportsActivityLocation): name, address, geo, openingHours, image, url. **No rating.** |
| `/card/[id]` | **No** | [Name]'s [Month] Notch Card | See the places [Name] notched this month in [City]. | — | — (OG image = the card, for sharing) |
| Login, passport, venue app, counter, admin, `/team*` | **No** | Plain titles only | — | — | — |
| 404 | No | Page not found | — | (keep current) | — |

Dynamic pages use `generateMetadata` and fetch only the fields they need. Category names
come from one config map (e.g. `cafes → "cafés"`), never hardcoded per page.

## 3. Index thresholds (real data only)

Keep the numbers in one file, `src/config/seo.ts`, so the team can change them.

| Page | Index when | Until then |
|---|---|---|
| `/ahmedabad` | At least 1 category page is indexable | noindex, not in sitemap |
| `/ahmedabad/[category]` | At least 5 live venues in that category with verified visits in the last 7 days | noindex; the page may say "More cafés join every week." |
| `/ahmedabad/v/[slug]` | Venue signed, counter live, real photo, hours and address filled in | noindex |

**The backend decides** whether a page passes, and sends a field like `is_indexable` in the
API. The frontend only reads it. No ranking maths in components.

## 4. On-page checks (every indexable page)

- Exactly one `h1`, then `h2`/`h3` in order with no skipped levels.
- Main text is real HTML text, never inside an image, canvas or map. On a map page, the
  stops must be readable text in the HTML in scroll order, and the map itself is
  decoration.
- Every `next/image` has a meaningful `alt` (e.g. venue name + area); decorative images
  get `alt=""`. Hidden slideshow frames get `alt=""` and `aria-hidden`.
- Every `next/image` has a `sizes` value matching its real on-screen width, so phones
  never fetch 3840-px files.
- Internal links use `next/link` with descriptive text, never "click here". Never add
  `?ref=` to internal links.
- At launch, footer links on every public page: How it works · For venues · Trust · FAQ ·
  Privacy · Terms (only pages that exist).

## 5. Speed (Core Web Vitals affect ranking)

- Fonts via `next/font`, loading only the weights actually used.
- The top (LCP) image uses `preload`/`priority` and shows immediately: no fade-in or
  JavaScript gate in front of it. Everything else lazy-loads.
- Heavy interactive parts (maps) load after the text; phones can get a static image.
- No layout shift: set width and height on every image, and reserve space for success
  states.
- **Targets (Lighthouse, mobile):** SEO 100, Accessibility 100, Best Practices 100,
  Performance at least 85 (aim for 90+).

## 6. Check your work (results go in the PR)

1. `npm run lint`, `npm run format:check`, `npm run build`, `npm run typecheck` all pass.
2. Run the production build locally (`SITE_ACCESS=public`). For each public route, print
   the head: `curl -s http://localhost:3100/<route> | grep -E "<title|description|canonical|robots|og:"`,
   and paste a short table in the PR.
3. Open `/robots.txt` and `/sitemap.xml`: private and noindex pages must not be listed.
4. `/?ref=test` must keep the canonical at `https://www.notchs.com`.
5. Structured data must be valid JSON with the right `@type`. After deploy, test the live
   URL at https://search.google.com/test/rich-results.
6. Run Lighthouse on the changed routes (command in `CLAUDE.md` §3) and record the scores.
7. List anything you skipped, and why.

## 7. Done by hand (not by Claude)

- Google Search Console: Domain property `notchs.com` (TXT record in Cloudflare DNS);
  submit `https://www.notchs.com/sitemap.xml`; request indexing for `/`.
- Bing Webmaster Tools: sign in → "Import from Google Search Console".
- Links back to the site: Instagram bio, YouTube, LinkedIn, WhatsApp Business profile,
  and creator bios with `?ref=` links.
