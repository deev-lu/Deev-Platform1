import { defineConfig, devices } from "@playwright/test";

/**
 * Browser tests for accessibility (tests/e2e). They run against the built
 * site, so build first:
 *
 *   npm run build && npm run test:a11y
 *
 * Not part of `npm run build` (that runs the unit tests only): a browser is
 * not available on every machine that builds the site. Install one once with
 * `npx playwright install chromium`, or point PLAYWRIGHT_CHROMIUM_PATH at an
 * existing Chromium.
 */
const executablePath = process.env.PLAYWRIGHT_CHROMIUM_PATH || undefined;
const PORT = 4175;

export default defineConfig({
  testDir: "tests/e2e",
  testMatch: /.*\.e2e\.ts$/,
  timeout: 60_000,
  fullyParallel: true,
  reporter: [["list"]],
  use: {
    baseURL: `http://localhost:${PORT}`,
    launchOptions: executablePath ? { executablePath } : undefined,
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } } },
    { name: "phone", use: { ...devices["Pixel 7"], viewport: { width: 390, height: 844 } } },
  ],
  webServer: {
    command: `npx vite preview --port ${PORT} --strictPort`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: true,
    timeout: 60_000,
  },
});
