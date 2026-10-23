## What and why

<!-- One or two sentences. Which mockup screen(s) does this build (e.g. C3 My Notchs)? -->

## Pages touched

<!-- List each path, e.g. /passport, and mark it PUBLIC or PRIVATE (login, passport, venue, admin, team). -->

## Checklist (CLAUDE.md)

- [ ] Branched from the latest `development`; this PR goes **into `development`**
- [ ] CI is green (lint, format, build, types, audit)
- [ ] Public pages: unique title (60 characters max), description (70–155 characters), relative canonical, one `<h1>`, alt text, content rendered on the server
- [ ] Private pages: `robots: { index: false }`, not in the sitemap, not linked from public pages
- [ ] Real data only: no invented counts, ranks, queue numbers or reviews; samples are labelled "Example"
- [ ] No secrets, `.env` files, design files or PDFs committed
- [ ] Team lock untouched (`guardTeamAccess` first in `src/proxy.ts`; `next.config.ts`, `netlify.toml`, robots and sitemap unchanged), or the change is explained below
- [ ] Checked on this PR's Netlify deploy preview (team login) on a phone-sized screen

## Notes for Harsh and Abhishek

<!-- Anything that needs a decision, and the deploy preview link. -->
