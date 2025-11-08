# Risk Frontend

A Vite + React single-page app for interacting with the risk analysis backend. Users can upload loan data, run retrieval-augmented queries, and (for CRO users) review historical ECL snapshots.

## Getting Started

```bash
npm install
npm run dev
```

The app expects an API endpoint exposed via the `VITE_API_BASE_URL` environment variable. You can define it in a `.env` file at the project root:

```
# Local dev points to your local FastAPI server
VITE_API_BASE_URL=http://localhost:8000

# For production, set this to the Render deployment:
# VITE_API_BASE_URL=https://risk-analysis-3bwh.onrender.com
```

## Deployment (Vercel)

Vercel can auto-detect the Vite setup. These settings are used via `vercel.json`:

- Build command: `npm run build`
- Output directory: `dist`
- SPA routing: all paths rewrite to `index.html`

Remember to add `VITE_API_BASE_URL` to your Vercel project environment variables for each environment (`Development`, `Preview`, `Production`).

## Scripts

- `npm run dev` – start Vite dev server
- `npm run build` – build the production bundle
- `npm run preview` – preview the built app locally
- `npm run lint` – run ESLint over the project
