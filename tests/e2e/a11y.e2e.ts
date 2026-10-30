import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

/**
 * Accessibility regression tests (WCAG 2.2 AA). They cover what an automated
 * scan can see and the keyboard behaviour of the components fixed in October
 * 2026. Passing them is not a conformance claim: screen-reader testing and a
 * manual review stay necessary (ACCESSIBILITY.md).
 *
 * Run against the built site: `npm run build && npm run test:a11y`.
 */

const PAGES = [
  "/",
  "/workshops",
  "/contact",
  "/about",
  "/services",
  "/services/ai-automation",
  "/services/custom-software",
  "/services/websites",
  "/services/marketing",
  "/sme-packages",
  "/project",
  "/work",
  "/work/billovio",
  "/blog",
  "/blog/custom-rag-explained",
  "/legal",
  "/de",
  "/fr/contact",
  "/does-not-exist",
];

const WCAG = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

/** Scroll the page once so lazy sections mount, then back to the top. */
async function settle(page: Page) {
  const height = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y < height; y += 700) {
    await page.evaluate((top) => window.scrollTo(0, top), y);
    await page.waitForTimeout(30);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(400);
}

async function rejectCookies(page: Page) {
  const reject = page.getByRole("button", { name: /^(Reject non-essential|Nicht notwendige ablehnen|Refuser les cookies non essentiels)$/ });
  await reject.first().click({ timeout: 4000 }).catch(() => undefined);
}

async function klarReady(page: Page) {
  await page.waitForFunction(() => {
    const k = (window as unknown as { KlarAccess?: { setSettings?: unknown } }).KlarAccess;
    return Boolean(k?.setSettings);
  });
}

test.describe("axe-core, WCAG 2.2 A and AA", () => {
  for (const theme of ["dark", "light"] as const) {
    for (const path of PAGES) {
      test(`${theme} ${path}`, async ({ page }) => {
        await page.addInitScript((t) => localStorage.setItem("theme", t), theme);
        await page.emulateMedia({ reducedMotion: "reduce" });
        await page.goto(path, { waitUntil: "networkidle" });
        await settle(page);
        const results = await new AxeBuilder({ page }).withTags(WCAG).analyze();
        const summary = results.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).slice(0, 3).join(", ")}`);
        expect(summary).toEqual([]);
      });
    }
  }
});

test.describe("keyboard", () => {
  test("skip link moves focus to the page content", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    const skip = page.getByRole("link", { name: "Skip to content" });
    // The accessibility menu's button may come first in the tab order.
    for (let i = 0; i < 3 && !(await skip.evaluate((el) => el === document.activeElement)); i++) {
      await page.keyboard.press("Tab");
    }
    await expect(skip).toBeFocused();
    await expect(skip).toBeInViewport();
    await page.keyboard.press("Enter");
    await expect.poll(() => page.evaluate(() => document.activeElement?.id)).toBe("main");
  });

  test("desktop menu: panel opens from its button, takes focus, Escape returns it", async ({ page }, info) => {
    test.skip(info.project.name !== "desktop", "the panels exist from 768px up");
    await page.goto("/", { waitUntil: "networkidle" });
    await rejectCookies(page);
    const link = page.getByRole("link", { name: "Services", exact: true }).first();
    await link.focus();
    // Focus alone must not open anything (WCAG 3.2.1).
    await expect(page.locator("#mega-services")).toHaveCount(0);
    const toggle = page.getByRole("button", { name: "Open the Services menu" });
    await toggle.focus();
    await page.keyboard.press("Enter");
    await expect(toggle).toHaveAttribute("aria-expanded", "true");
    await page.keyboard.press("Tab");
    await expect.poll(() => page.evaluate(() => Boolean(document.getElementById("mega-services")?.contains(document.activeElement)))).toBe(true);
    await page.keyboard.press("Escape");
    await expect(page.locator("#mega-services")).toHaveCount(0);
    await expect(toggle).toBeFocused();
  });

  test("phone menu: button states, Escape closes and returns focus", async ({ page }, info) => {
    test.skip(info.project.name !== "phone", "the drawer is the phone navigation");
    await page.goto("/", { waitUntil: "networkidle" });
    await rejectCookies(page);
    const burger = page.getByRole("button", { name: "Open menu" });
    await expect(burger).toHaveAttribute("aria-expanded", "false");
    await burger.click();
    const close = page.getByRole("button", { name: "Close menu" });
    await expect(close).toHaveAttribute("aria-expanded", "true");
    await expect(page.locator("#mobile-menu").getByRole("link", { name: "Workshops" })).toBeVisible();
    await close.focus();
    await page.keyboard.press("Escape");
    await expect(page.locator("#mobile-menu")).toHaveCount(0);
    await expect(burger).toBeFocused();
  });

  test("cookie settings: focus in, trapped, Escape closes, focus back", async ({ page }) => {
    await page.goto("/legal", { waitUntil: "networkidle" });
    await rejectCookies(page);
    const opener = page.locator("footer").getByRole("button", { name: "Cookie settings" });
    await opener.scrollIntoViewIfNeeded();
    await opener.focus();
    await page.keyboard.press("Enter");
    const dialog = page.getByRole("dialog", { name: "What you allow, category by category." });
    await expect(dialog).toBeVisible();
    await expect.poll(() => dialog.evaluate((d) => d.contains(document.activeElement))).toBe(true);
    for (let i = 0; i < 25; i++) await page.keyboard.press("Tab");
    expect(await dialog.evaluate((d) => d.contains(document.activeElement))).toBe(true);
    await page.keyboard.press("Escape");
    await expect(dialog).toHaveCount(0);
    await expect(opener).toBeFocused();
  });

  test("calculator lead form is a modal dialog with labelled fields", async ({ page }) => {
    await page.goto("/project", { waitUntil: "networkidle" });
    await rejectCookies(page);
    const options = page.locator("button[aria-pressed]");
    await options.first().click();
    await expect(options.first()).toHaveAttribute("aria-pressed", "true");
    await page.getByRole("button", { name: /^Continue/ }).click();
    await page.locator("button[aria-pressed]").first().click();
    await page.getByRole("button", { name: /^Continue/ }).click();
    const calculate = page.getByRole("button", { name: /^Calculate Estimate/ });
    await calculate.click();
    const dialog = page.getByRole("dialog", { name: "One last step" });
    await expect(dialog).toBeVisible();
    await expect.poll(() => dialog.evaluate((d) => d.contains(document.activeElement))).toBe(true);
    for (const label of ["Your name", "Work email", "Company (optional)", "Current website (optional)", "When do you want to start?"]) {
      await expect(dialog.getByLabel(label, { exact: false }).first()).toBeVisible();
    }
    await page.keyboard.press("Escape");
    await expect(dialog).toHaveCount(0);
    await expect(calculate).toBeFocused();
  });
});

test.describe("forms", () => {
  for (const path of ["/contact", "/workshops"]) {
    test(`${path}: every field has a visible label`, async ({ page }) => {
      await page.goto(path, { waitUntil: "networkidle" });
      await settle(page);
      const unlabeled = await page.evaluate(() =>
        [...document.querySelectorAll<HTMLInputElement>("form input, form select, form textarea")]
          .filter((el) => el.type !== "hidden" && el.getClientRects().length > 0)
          .filter((el) => !el.labels?.length || !(el.labels[0].textContent || "").trim())
          .map((el) => el.outerHTML.slice(0, 80)),
      );
      expect(unlabeled).toEqual([]);
      await expect(page.getByText("Fields marked * are required.")).toBeVisible();
    });
  }

  test("/sme-packages: the result form has visible labels", async ({ page }) => {
    await page.goto("/sme-packages", { waitUntil: "networkidle" });
    await rejectCookies(page);
    const check = page.locator("button[aria-pressed]").first();
    await check.scrollIntoViewIfNeeded();
    await check.click();
    await expect(check).toHaveAttribute("aria-pressed", "true");
    await expect(page.getByLabel("Work email")).toBeVisible();
    await expect(page.getByLabel("Company (optional)")).toBeVisible();
  });
});

test.describe("motion (WCAG 2.2.2)", () => {
  test("Pause motion stops the moving parts, and is remembered", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    await rejectCookies(page);
    const toggle = page.locator("footer").getByRole("button", { name: "Pause motion" });
    await toggle.scrollIntoViewIfNeeded();
    await toggle.click();
    await expect(page.locator("html")).toHaveClass(/motion-paused/);
    await expect(page.locator("footer").getByRole("button", { name: "Play motion" })).toBeVisible();
    // The client carousel stops advancing by itself.
    await expect(page.locator("section[aria-roledescription='carousel']")).toHaveAttribute("data-autoplay", "false");
    await page.reload({ waitUntil: "networkidle" });
    await expect(page.locator("html")).toHaveClass(/motion-paused/);
  });

  test("the site's switch and Klar Access's stay in step", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    await rejectCookies(page);
    await klarReady(page);
    await page.evaluate(() => (window as unknown as { KlarAccess: { setSettings: (s: object) => void } }).KlarAccess.setSettings({ motion: true }));
    const play = page.locator("footer").getByRole("button", { name: "Play motion" });
    await expect(play).toBeVisible();
    // Fade-ins show their content instead of freezing invisible.
    const opacities = await page.locator(".m-fade-up").evaluateAll((els) => els.map((e) => getComputedStyle(e).opacity));
    expect(opacities.every((o) => o === "1")).toBe(true);
    await play.scrollIntoViewIfNeeded();
    await play.click();
    await expect(page.locator("html")).not.toHaveAttribute("data-ka-motion", "");
    const klarMotion = await page.evaluate(() => (window as unknown as { KlarAccess: { getSettings: () => { motion: boolean } } }).KlarAccess.getSettings().motion);
    expect(klarMotion).toBe(false);
  });
});

test.describe("zoom, reflow and enlarged text", () => {
  test("no sideways scrolling at 320 CSS pixels (WCAG 1.4.10)", async ({ browser }) => {
    test.setTimeout(240_000);
    const context = await browser.newContext({ viewport: { width: 320, height: 640 }, reducedMotion: "reduce" });
    const page = await context.newPage();
    const wide: string[] = [];
    for (const path of PAGES) {
      await page.goto(path, { waitUntil: "networkidle" });
      await settle(page);
      const { sw, cw } = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth }));
      if (sw > cw) wide.push(`${path}: ${sw} > ${cw}`);
    }
    await context.close();
    expect(wide).toEqual([]);
  });

  test("Klar Access text size 200%: nothing pushed off screen", async ({ page }) => {
    test.setTimeout(240_000);
    for (const path of ["/", "/workshops", "/services/ai-automation", "/sme-packages", "/contact"]) {
      await page.goto(path, { waitUntil: "networkidle" });
      await klarReady(page);
      await page.evaluate(() => (window as unknown as { KlarAccess: { setSettings: (s: object) => void } }).KlarAccess.setSettings({ size: 4 }));
      await settle(page);
      const problems = await page.evaluate(() => {
        const cw = document.documentElement.clientWidth;
        const out: string[] = [];
        if (document.documentElement.scrollWidth > cw) out.push(`page ${document.documentElement.scrollWidth} > ${cw}`);
        for (const el of document.querySelectorAll<HTMLElement>("header a, header button")) {
          const r = el.getBoundingClientRect();
          if (r.width && getComputedStyle(el).display !== "none" && (r.right > cw + 1 || r.left < -1)) out.push(`header control off screen: ${el.textContent?.trim() || el.getAttribute("aria-label")}`);
        }
        return out;
      });
      expect(problems, path).toEqual([]);
      await page.evaluate(() => (window as unknown as { KlarAccess: { reset: () => void } }).KlarAccess.reset());
    }
  });
});
