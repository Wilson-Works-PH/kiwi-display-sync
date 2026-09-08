# Kiwi — marketing site

Marketing site for the Kiwi digital-signage platform (the product lives in the adjacent
`kiwi-signage-frontend` and `kiwi-signage-backend` repos).

- **Stack:** Vite + React 19 + TypeScript + Tailwind 4, `react-router-dom`. Light-only.
- **Fonts:** Fraunces (headlines), Instrument Sans (UI), Lato (body) via Fontsource.
- **Routes:** `/` the site, `/privacy` the privacy policy the app stores link to,
  `/art/:scenario/:index` a dev helper for rendering demo content. Everything else redirects home.
- **Media:** the hero and "See Kiwi in action" clips are recordings of the real CMS
  (`scripts/record-cms.mjs` + `scripts/encode-clip.sh`, see CLAUDE.md).

```sh
npm install
npm run dev      # http://localhost:5174
npm run build && npm run lint
```

Deploy as a static SPA with a fallback of every path to `index.html`. See `CLAUDE.md` for the
ground rules (brand tokens, truthful copy, real pricing) and the recording pipeline.
