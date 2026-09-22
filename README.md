# Permit Rockstar — Portal

Enterprise-grade construction permit management portal, rebuilt with a
premium visual design system layered on top of the existing product
information architecture. This pass focuses on the **Review Plans** flow
(Upload → Processing → Annotate → Export) end to end, with the rest of the
sidebar scaffolded as routed placeholder pages ready for the next build
pass.

## Stack

- **Next.js 16 (App Router)** + **TypeScript**
- **Tailwind CSS v4** (CSS-native `@theme` tokens — no `tailwind.config.js`)
- **Lucide React** icons
- Self-hosted variable **Inter** font (`next/font/local`) — no runtime
  dependency on Google Fonts, which also keeps the PWA shell fully
  self-contained offline
- Mock data / mock async services, shaped like real API calls
- Deploy target: **Vercel**

## Getting started

```bash
npm install
npm run dev       # http://localhost:3000 (redirects to /review-plans)
```

```bash
npm run build && npm run start   # production build
npm run lint                      # ESLint
```

## Design system

Brand tokens live in `src/app/globals.css` under `@theme`:

| Token | Hex | Use |
|---|---|---|
| `--color-ink` | `#17130f` | Sidebar, primary text, dark surfaces |
| `--color-gold` | `#f2a91c` | Logo accent, active icon states |
| `--color-rust` | `#c1440e` | Primary actions, in-progress states |
| `--color-forest` | `#33562f` | Success / "move forward" actions |
| `--color-alert` | `#ae2a1f` | Rejections, destructive states |
| `--color-paper` | `#faf7f1` | App background |

Two subject-matter motifs run through the UI instead of generic SaaS
chrome:

- **`.blueprint-grid`** — a graph-paper texture behind plan canvases and
  the upload dropzone, echoing construction drawings.
- **`.stamp`** — a rotated, double-ringed badge style used for review
  statuses (Note / Correction / Rejection), echoing a permit stamp.

Utility classes (`bg-ink`, `text-rust`, `bg-forest-soft`, etc.) are
generated automatically from these tokens — no separate color config to
keep in sync.

## Architecture

```
src/
  app/
    layout.tsx              Root layout, self-hosted Inter, PWA metadata
    globals.css              Design tokens + brand utilities
    page.tsx                 Redirects to /review-plans
    review-plans/page.tsx    Review Plans route
    stamp/, pca/, saved-pca/, inspections/,
    cities-emails/, users/, notifications/   Placeholder routes
  components/
    layout/                  Sidebar, MobileNav, AppShell, PlaceholderPage
    review-plans/            StepRail, UploadStep, ProcessingStep,
                              AnnotateStep, ExportStep, ReviewPlansWizard
    ui/                      Button, Card, StampBadge
  lib/
    types.ts                 Shared domain types
    mock-data.ts              Mock services + seed data
```

### Swapping mock data for real APIs

Every mock function in `lib/mock-data.ts` (`mockUploadFiles`,
`mockRunProcessing`, `mockExportDocument`, `buildMockDocument`) is
`async` and returns/produces the same shapes defined in `lib/types.ts`.
Components never import mock data directly for business logic — they
call these functions through `ReviewPlansWizard`. To go to production:

1. Replace the bodies of the `mock*` functions with real `fetch`/SDK
   calls that resolve to the same types.
2. Point `NAV_ITEMS` at real permission-gated routes if needed.
3. No component files need to change.

### PWA

`public/manifest.json` and `public/icon.svg` are in place and linked
from `layout.tsx`. A service worker is not yet registered — add one
(e.g. via `next-pwa` or a hand-rolled `sw.js`) when the Driver Portal
scope is built out, since Review Plans is primarily a desktop/tablet
reviewer workflow.

## What's implemented vs. scaffolded

- **Fully built**: Review Plans (all 4 steps), sidebar/mobile nav, design
  system, mock data layer.
- **Scaffolded (placeholder UI, routed, ready for content)**: Stamp, PCA,
  Saved PCA, Inspections, Cities & Emails, Users, Notifications.
