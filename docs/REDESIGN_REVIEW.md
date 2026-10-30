# Skyrise professional website redesign — review checklist

This redesign is on a separate branch; it does not migrate or modify existing Firebase records.

## Public site checks
- [ ] Home at /: accessible mobile navigation, hero, actual project images, projects, service capabilities, pricing, global section and inquiry form.
- [ ] Project cards open detailed case-study modal with the existing project data.
- [ ] Pricing selectors switch among US, South Africa and Zimbabwe without showing rates from the wrong country.
- [ ] /us, /za and /zw show the local package lists and subscription versus outright ownership terms.
- [ ] /how-it-works, /login and all admin routes maintain readable, consistent light styling.
- [ ] Contact form still submits under messages and admin inbox displays existing messages.

## Pricing editor
- [ ] Visit /admin/pricing using an authorized administrator session.
- [ ] Edit a package in a test Firebase environment, save and verify it updates both / and /us (or the corresponding region).
- [ ] Verify a different region's packages remain unchanged.
- [ ] Verify unsaved edits prompt before region switching or tab closing.
- [ ] Confirm read/write database permissions before production release.

## Data compatibility
No migrations were applied. The original compiled pricing remains in src/data/waas-pricing.ts.
Optional pricing overrides are stored in existing Firebase RTDB at content/waasPricing/{us,za,zw}, with packages and updatedAt.
Existing content/hero, content/projects, content/global, content/techStack, content/footer, projects and messages paths remain.

## Security release blocker
The inherited login mechanism uses static client-side credentials and a localStorage flag. A UI-only route guard does not authorize Firebase database writes. Before exposing pricing edits on production, use verified Firebase Authentication and admin-restricted RTDB write rules. Do not grant public writes to content/waasPricing. This change is deliberately outside the UI-focused redesign and must be separately verified.

## Engineering
- [ ] Run npm ci, npm run typecheck, npm run build.
- [ ] Test keyboard navigation, focus states, alt text and mobile layout.
- [ ] Verify that deployments configured with NEXT_PUBLIC_SITE_URL=https://skyrise.dev have correct SEO canonical links.
