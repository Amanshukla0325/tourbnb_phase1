## Dev setup notes (Windows)

This project uses `vitest/vite` and lightningcss binaries that can sometimes be locked on Windows.

If you run into an EPERM error during `npm ci` or `npm run dev`, run:

```
npm run clean:win
npm run dev
```

If you still run into problems, close editors/terminals and try a reboot or run as Administrator. Also try disabling antivirus briefly.

Note on `components.json` and `shadcn`:
- The `components.json` file is used by the shadcn CLI to scaffold and update component files. It helps you generate components and wire them into the project, but it doesn't configure the build tools (Tailwind / PostCSS).
- If your UI appears unstyled, first verify Tailwind is compiling (check dev server logs for warnings), then ensure `src/index.css` contains `@tailwind base/components/utilities` and that `postcss.config.js` uses `tailwindcss` plugin.


This file is here to help developers on Windows avoid common hiccups during development.
