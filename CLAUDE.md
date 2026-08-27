# Speedee Drains & Plumbing — Project Notes

Static HTML/CSS/JS marketing site for Speedee Drains and Plumbing (Fullerton, CA).

## Git workflow — standing authorization

The user has authorized automatic git management for this repo. Unless told otherwise for a specific change:

- After making a meaningful set of file changes, stage, commit, and push to `origin main` without asking for confirmation each time.
- Still follow standard git hygiene: review `git status`/`git diff` before staging, write a clear commit message describing the "why," never force-push, never skip hooks, never amend existing commits (always create new ones).
- Still pause and ask before anything destructive or hard-to-reverse (history rewrites, branch deletion, resetting shared history) — auto-push of normal forward commits is in scope; those are not.
- If a commit touches something that looks like it could contain secrets/credentials, stop and flag it instead of pushing.

## Site structure

Pure static site, no build step, no backend. Root-relative paths (`/css/style.css`, `/assets/...`) throughout — every page's shared header/footer chrome is copied byte-for-byte from `index.html`.

- `css/style.css` — full design system (colors, components)
- `js/script.js` — mobile nav, dropdowns, gallery lightbox, FAQ accordions, Formspree AJAX form submit
- `assets/` — logo, provided photos, onboarding/reference docs
- Forms point to `https://formspree.io/info@speedeedrains.com` (Formspree's no-signup email-endpoint pattern — first real submission needs a one-time confirmation click by the client)
