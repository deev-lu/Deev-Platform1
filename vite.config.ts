import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'


function figmaAssetResolver() {
  return {
    name: 'figma-asset-resolver',
    resolveId(id) {
      if (id.startsWith('figma:asset/')) {
        const filename = id.replace('figma:asset/', '')
        return path.resolve(__dirname, 'src/assets', filename)
      }
    },
  }
}

// /hub and everything under it is the Business Hub app (hub.html), as the
// rewrite in vercel.json does in production. Same rule for `vite` and
// `vite preview`, so the app can be opened locally at its real address.
function hubRewrite() {
  const rewrite = (req: { url?: string }, _res: unknown, next: () => void) => {
    if (req.url && /^\/hub(\/|\?|$)/.test(req.url) && !/\.[a-z0-9]+(\?|$)/i.test(req.url.split('?')[0])) {
      req.url = '/hub.html'
    }
    next()
  }
  return {
    name: 'hub-rewrite',
    configureServer(server: { middlewares: { use: (fn: typeof rewrite) => void } }) {
      server.middlewares.use(rewrite)
    },
    configurePreviewServer(server: { middlewares: { use: (fn: typeof rewrite) => void } }) {
      server.middlewares.use(rewrite)
    },
  }
}

export default defineConfig({
  plugins: [
    figmaAssetResolver(),
    hubRewrite(),
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],

  // Two documents: the website (index.html) and the Business Hub app
  // (hub.html, served under /hub by a rewrite in vercel.json). Separate
  // bundles, so the website never loads the app's code. The SSR build passes
  // its own entry on the command line, which takes precedence over these.
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        hub: path.resolve(__dirname, 'hub.html'),
      },
    },
  },
})
