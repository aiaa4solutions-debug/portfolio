# CI and Netlify operations

## Reproduce the pipeline

Use Node from `.nvmrc` and npm 11.9.0. Run `npm ci`, `npm run check`,
`npm audit --audit-level=high`, and `npm run build`.
Install Chromium once with `npx --no-install playwright install --with-deps chromium`.
Then run `CI=1 MARKET_MODE=replay PLAYWRIGHT_USE_BUILD=1 npm run test:e2e`.
E2E tests start the existing production build; CI builds once, explicitly.
For a system Chromium, set `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium`.
Tests exercise simulated market data, not the availability of real exchanges.
The build requires access to Google Fonts.

CI runs on pull requests, pushes to main, manually, and weekly. It uses read-only
GitHub permissions, pinned action commits, a frozen npm install, limited workers,
a timeout, cancellation of superseded runs, and short-lived browser diagnostics.
Dependabot proposes npm and action updates; review and run CI before merging.
The dependency audit includes production and development packages and fails for
high/critical advisories. It requires the npm registry; its result is a point-in-time
check, not a guarantee that new vulnerabilities cannot appear.

## Deployment and external settings

`netlify.toml` pins the runtime and runs lint, type checks, unit tests and a production
build before Netlify publishes. Keep Netlify's native Next.js runtime enabled;
this app uses dynamic SSE route handlers and must not be deployed as a static export.
Do not set `MARKET_MODE=replay` globally on Netlify: production defaults to auto/live.
Do not commit tokens, local `.env` files, or generated browser traces.
Public `NEXT_PUBLIC_*` variables are embedded in browser bundles, not secrets.

Repository files cannot enable GitHub branch protection or change Netlify dashboard
settings. A repository administrator should configure a main-branch ruleset:
require pull requests and the `checks` job, block force pushes/deletion, require
resolved review conversations, and limit bypass privileges to maintainers.
Verify the exact check name in GitHub before making it required.
This makes the browser suite a merge gate. Netlify's build command independently
blocks lint/type/unit/build failures, but does not wait for GitHub E2E results on
a direct push. Until branch protection is enabled, direct pushes can bypass that gate.

In Netlify, verify production branch `main`, enable Deploy Previews for PRs, and
review notifications for failed builds. Avoid competing custom deployment workflows:
the native Git integration owns publishing, previews and rollback.
Enable GitHub Dependabot alerts/security updates and secret scanning where available.
Those settings and remote run results must be verified in the dashboards; adding
configuration files alone does not establish that they are active.

## Readiness and incident handling

With the production server running, run `npm run test:smoke`. After a deployment,
run `SMOKE_BASE_URL=https://herimalala.netlify.app npm run test:smoke`.
It checks the home page, BTC page and `/api/health`. The health endpoint exposes
only application liveness, never secrets or exchange availability.
Monitor these URLs externally and configure notification recipients in your monitor.
No external monitor or notification service is provisioned by these files.

If a deployment fails, inspect the Netlify build log and GitHub `checks` diagnostics.
If a published version regresses, restore the previous successful published deploy
from Netlify's Deploys dashboard, then fix/revert the offending commit through a PR.
Do not rewrite main history or force-push as a rollback mechanism.
For Binance outages inspect `[hub:BINANCE]` server logs and outbound WebSocket access
to `data-stream.binance.vision:443`; do not label simulated data as live.
Netlify function duration/streaming and instance lifetimes depend on the hosting
runtime/plan: the shared hub is per process, not globally shared across all instances.

## Dependency remediation

Next.js and its ESLint configuration are kept on patched 15.5.28. Next pins an
older PostCSS internally, so `overrides.next.postcss` uses the same patched
PostCSS 8.5.x as the build. Remove this override once Next's dependency is safe.
Sharp is updated within the version range supported by this Next release.
These changes must pass production build, image generation and browser tests;
never use `npm audit fix --force` to silently introduce a framework major upgrade.
