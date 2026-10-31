# Project live links and imagery QA

## Link behavior
The "Explore project" CTA is a real external hyperlink (`target=_blank`, `rel=noopener noreferrer`) whenever the existing project record has a valid public URL.
- Supported fields: `websiteUrl`, `liveUrl`, `projectUrl`, `url`, `link`, `website`.
- An entire description containing a domain (e.g., `www.nestsafrica.com`) is accepted for legacy records.
- Verified NESTS and Leasio projects have fallback destinations: https://www.nestsafrica.com/ and https://www.leasio.co.za/.
- Unsafe URL schemes, credentials, local addresses, or malformed links do **not** become external navigation.
- If a project has no valid link, the CTA says "View case study" and opens the existing detail dialog.
- Clicking a device screenshot opens the dialog regardless of live-link status.
- The duplicated carousel group remains interactive, even when scrolling near the loop seam.

## Editor
The existing Add/Edit project pages now include an optional Live Website URL field, validated and saved to the current `projects` collection as `websiteUrl`. Existing Firebase data and pricing schemas are untouched; no migration or direct database updates were made.

## Editorial photography
See `docs/EDITORIAL_PHOTOGRAPHY.md`. The photos are illustrational and do not claim to show Skyrise employees or delivered client work.

## Review checklist
- [ ] NESTS and Leasio open their websites from Explore project, in new tabs.
- [ ] NOVA and other projects without live URLs retain View case study modal action.
- [ ] Project card screenshots, case-study dialogs, continuous carousel and mobile swipe still work.
- [ ] Add/Edit project form validates malicious/invalid URLs and saves valid links in Firebase test environment.
- [ ] Both editorial photos render with readable surrounding typography at desktop/tablet/mobile.
- [ ] Vercel build passes; ensure CSS retains the original clean white/navy visual identity.
