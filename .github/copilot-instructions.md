# Copilot Instructions

Give contributors fast, context-aware help when paired with this repo:

1. **Assume monorepo context.** Reference `apps/frontend` (Vite React) and `apps/backend` (Express) explicitly. Default paths and imports should use that layout.
2. **Prefer TypeScript + Tailwind idioms.** Use functional components, hooks, and Tailwind utility classes for any generated UI code. Avoid class components.
3. **Keep the lacquer theme.** Default palette: `#0a0000` background, `#D42B2B` primary, off-white accents. Typography = editorial serif + grotesk pairing.
4. **APIs live under `/api`.** When suggesting fetch/axios code, target `http://localhost:5001/api/...` and reuse helpers from `src/services/api.ts` when possible.
5. **No secrets.** Never hardcode credentials. Point devs to `.env.example` instead.

Be concise—answer in English, stick to instructions above, and avoid scaffolding commands unless asked.
