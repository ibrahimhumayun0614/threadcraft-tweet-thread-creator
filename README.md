# Threadcraft

[cloudflarebutton]

A production-ready full-stack starter template for Cloudflare Workers and Pages. Built with React, TypeScript, Tailwind CSS, shadcn/ui, and Hono for a modern developer experience.

## Features

- **React 18 + Vite**: Lightning-fast development server and optimized builds.
- **TypeScript**: Full type safety across frontend and Workers backend.
- **Tailwind CSS + shadcn/ui**: Beautiful, customizable UI components with dark mode.
- **Cloudflare Workers Backend**: API routes powered by Hono with automatic CORS and error handling.
- **TanStack Query**: Efficient data fetching, caching, and synchronization.
- **Immer + Zustand**: Predictable state management (ready for your needs).
- **Error Handling**: Comprehensive error boundaries and client-side error reporting to Workers.
- **Theme System**: Automatic dark/light mode with persistence.
- **Responsive Design**: Mobile-first layout with sidebar support.
- **Production Optimized**: Tree-shaking, code-splitting, and Cloudflare-specific bundling.

## Tech Stack

| Category | Technologies |
|----------|--------------|
| **Frontend** | React 18, Vite, TypeScript, Tailwind CSS, shadcn/ui, Lucide Icons, Framer Motion, TanStack Query, React Router, Sonner (Toasts) |
| **Backend** | Cloudflare Workers, Hono |
| **State/UI** | Immer, Zustand (optional), Headless UI, Radix UI |
| **Utilities** | clsx, tailwind-merge, date-fns, Zod, UUID |
| **Dev Tools** | Bun, ESLint, TypeScript ESLint, Wrangler |

## Quick Start

1. **Clone & Install**:
   ```bash
   git clone <your-repo-url>
   cd threadcraft-a0guj9knity3mahd9t6_p
   bun install
   ```

2. **Development**:
   ```bash
   bun dev
   ```
   Opens at `http://localhost:3000` (or `$PORT`).

3. **Build & Preview**:
   ```bash
   bun build
   bun preview
   ```

## Local Development

- **Frontend**: Served via Vite on port `3000`.
- **Backend**: Cloudflare Workers routes under `/api/*` (proxied locally).
- **Types**: Run `bun cf-typegen` (or `wrangler types`) to generate Worker bindings.
- **Hot Reload**: Full HMR for React and CSS changes.
- **Linting**: `bun lint` for code quality.

### Project Structure

```
├── src/              # React app (pages, components, hooks, lib)
├── worker/           # Cloudflare Workers backend (add routes in userRoutes.ts)
├── public/           # Static assets
├── tailwind.config.js # Design system
└── wrangler.jsonc    # Workers config
```

- **Frontend Pages**: Edit `src/pages/HomePage.tsx` as your app entry.
- **Backend Routes**: Add to `worker/userRoutes.ts` (e.g., `app.get('/api/test', ...)`).
- **Components**: Use shadcn/ui from `@/components/ui/*` or `npx shadcn-ui@latest add <component>`.

### Environment Variables

Set via Cloudflare dashboard or `wrangler.toml`:
```toml
[vars]
API_KEY = "your-key"
```

## Deployment

Deploy to Cloudflare Pages + Workers with one command:

```bash
bun deploy
```

Or manually:
1. **Build Assets**: `bun build`
2. **Deploy Workers**: `wrangler deploy`
3. **Pages**: Connect repo to [Cloudflare Pages](https://pages.cloudflare.com/).

[cloudflarebutton]

Automatic asset bundling to Cloudflare Pages with Workers fallback for `/api/*`.

### Custom Domain & Secrets

- `wrangler secret put <KEY>` for secrets.
- Configure custom domains in Cloudflare dashboard.

## Customization

- **Sidebar**: Edit `src/components/app-sidebar.tsx` or remove from layout.
- **Theme**: Customize in `tailwind.config.js` and `src/index.css`.
- **Routes**: Use React Router in `src/main.tsx`.
- **API**: Extend `worker/userRoutes.ts` without touching `index.ts`.

## Scripts

| Command | Description |
|---------|-------------|
| `bun dev` | Start dev server |
| `bun build` | Build for production |
| `bun lint` | Lint codebase |
| `bun preview` | Preview production build |
| `bun deploy` | Full deploy |
| `bun cf-typegen` | Generate Worker types |

## Contributing

1. Fork & clone.
2. `bun install`.
3. Make changes & `bun lint`.
4. PR with clear description.

## License

MIT. See [LICENSE](LICENSE) for details.

---

⭐ Star us on GitHub! Questions? Open an issue.