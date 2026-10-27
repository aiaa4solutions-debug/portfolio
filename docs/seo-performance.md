# SEO and performance

## Local audit evidence

Lighthouse 13.5.0, simulated mobile, fresh Chromium profiles, local production builds.
These single runs are diagnostic lab measurements, not production field data or search rankings.
Intermediate optimization reports are retained with the final report in the execution workspace.

| Check | Before | After |
| --- | ---: | ---: |
| Performance | 90 | 96 |
| Accessibility | 96 | 100 |
| Best practices | 96 | 100 |
| Basic SEO checks | 100 | 100 |
| LCP | 3.3 s | 2.6 s |
| Total blocking time | 180 ms | 120 ms |
| CLS | 0 | 0 |
| Initial JavaScript transfer | 221.3 KiB | 174.8 KiB |
| Font transfer | 87.7 KiB | 47.8 KiB |


## Implemented changes

- Static home sections render on the server. CSS scroll animations progressively
  enhance visible content and respect reduced motion; the animation JS dependency
  is removed. Contact actions, language selection and project route modals remain interactive.
- The Bitcoin charts load on demand when curves/spread are selected. The table
  does not download Recharts up front.
- Inter uses optional font display; slow first visits can use a matching fallback.
  Monospace text uses system fonts, removing a second font download. Images retain
  responsive sizing, lazy loading and fixed dimensions through Next Image.
- Site identity and canonical origin are centralized in `lib/seo.ts`. Each project
  has its own canonical URL, Open Graph/Twitter metadata and social image.
- Structured data describes the Person, WebSite, ProfilePage, project CreativeWork
  and project breadcrumbs. Mockups are not presented as deployed software products.
- The sitemap contains actual public pages, without fictitious modification dates.
  API routes are excluded from crawling and emit `X-Robots-Tag: noindex, nofollow`.
- A favicon removes a failed request. Cyan button contrast and the accessible
  names of the language selector are corrected.

The basic Lighthouse SEO score was already 100 before this work; it does not
assess the relevance of inherited social metadata or establish actual Google indexation.
The measured LCP remains slightly above the 2.5 s good threshold in this simulation;
measure the deployed site and real-user data before claiming Core Web Vitals pass.

## Reproduce

Build with `npm ci`, `npm run check`, and `npm run build`. Start the production
server with `MARKET_MODE=replay npm run start`, then in a separate terminal:

```bash
npm exec --package=lighthouse@13.5.0 -- lighthouse http://127.0.0.1:3000 \
  --chrome-flags="--headless --no-sandbox --disable-dev-shm-usage" \
  --only-categories=performance,accessibility,best-practices,seo \
  --output=json --output=html --output-path=/tmp/portfolio-lighthouse
```

The command needs Chromium. Shared CPU, browser versions, cache and network
conditions affect scores; compare like-for-like reports, not isolated score changes.
Run `npm run test:e2e -- e2e/seo.spec.ts` for server metadata, social images,
structured data, sitemap/robots and no-JavaScript contact navigation checks.
The main CI workflow includes these tests automatically.

## Search Console and deployed verification

1. Add the URL-prefix property `https://herimalala.netlify.app/` in Google Search Console.
2. Select HTML-tag verification. Put Google's public verification token in Netlify's
   `GOOGLE_SITE_VERIFICATION` build variable, then rebuild/redeploy. The root metadata
   emits that tag only when the variable is present. No private Google credentials
   belong in the app or repository.
3. Verify ownership in Search Console and submit `https://herimalala.netlify.app/sitemap.xml`.
4. Inspect the home page and project URLs, monitor indexing and Core Web Vitals,
   and use PageSpeed Insights to measure the published site.
5. Check that Netlify Deploy Previews are not indexed; production canonical URLs
   alone do not replace a preview noindex policy.

Ownership verification, sitemap submission, production scores and ranking changes
have not been performed or confirmed from this environment. The execution network
blocked the public Netlify origin with a proxy CONNECT 403 response; this is not
proof of a site error.

## Language scope

Current canonical URLs render English content on the server; browser detection and
manual selection translate the UI into French after hydration. Separate French
indexation needs stable French URLs, server-rendered translated metadata/content,
and reciprocal hreflang links. No fictitious French alternate URLs are declared.
