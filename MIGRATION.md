# Migration Plan: ditherit v3 → ditherit.com

## Overview

Move v3 to the main `ditherit.com` domain while preserving v2 at `v2.ditherit.com`.

---

## Step 1 — Preserve v2 at a subdomain

Do this first, before touching anything in the v3 repo or Netlify build settings.

1. Log in to Netlify and open the current ditherit.com site (connected to `alexharris/ditherit-v2`)
2. Go to **Site configuration > Domain management**
3. Add `v2.ditherit.com` as a custom domain
4. In your DNS provider, add a CNAME record: `v2` → the Netlify subdomain (e.g. `your-site-name.netlify.app`)
5. Wait for SSL certificate to provision and verify `v2.ditherit.com` loads correctly
6. Remove `ditherit.com` as the primary domain from this Netlify site (or leave it until Step 4)

---

## Step 2 — Create a new Netlify site for v3

1. In Netlify, click **Add new site > Import an existing project**
2. Connect to GitHub and select `alexharris/ditherit-v3`
3. Netlify will detect `netlify.toml` automatically — no manual build settings needed
4. Deploy the site and verify it builds successfully at the temporary Netlify URL (e.g. `ditherit-v3.netlify.app`)

---

## Step 3 — Point ditherit.com to v3

1. In the new v3 Netlify site, go to **Domain management**
2. Add `ditherit.com` and `www.ditherit.com` as custom domains
3. In your DNS provider, update the records to point to the new Netlify site:
   - `ditherit.com` → Netlify DNS or A record as instructed
   - `www.ditherit.com` → CNAME to the v3 Netlify subdomain
4. Wait for SSL to provision and verify `ditherit.com` loads v3

---

## Step 4 — Clean up

1. Confirm `ditherit.com` serves v3 and `v2.ditherit.com` serves v2
2. Remove `ditherit.com` from the v2 Netlify site's domain list if not already done
3. Optionally rename the `ditherit-v3` GitHub repo to `ditherit` (GitHub > Settings > Rename) — not required but tidier

---

## Notes

- `netlify.toml` is already committed to the v3 repo with the correct build settings (`pnpm generate`, publish dir `.output/public`, Node 22)
- The `ditherit-v2` GitHub repo does not need to be modified at any point — v2 keeps deploying from `master` as-is
- DNS propagation can take a few minutes to a few hours depending on your provider
- Netlify provisions SSL automatically once DNS is verified
