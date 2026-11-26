import { test, expect, type Page, type Route } from "@playwright/test";

/**
 * Die zwei Wege zur Anfrage (seit dem 25.11.2026), von Anfang bis Ende:
 *
 *   1. Erster Bildschirm -> Referenz (Feltes) -> "Aehnliches
 *      Projekt anfragen" -> Formular mit Referenz -> Absenden.
 *   2. "Was kostet meine Website?" -> Rechner mit vorausgewaehlter Website
 *      -> Schaetzung ohne Kontaktdaten -> Angebotsanfrage mit Konfiguration.
 *
 * /api/lead wird im Browser abgefangen: es geht keine echte E-Mail raus.
 * Geprueft wird ausserdem, dass ein gescheiterter Versand keinen Erfolg
 * zeigt und die Eingaben stehen bleiben.
 */

type Lead = Record<string, string>;

async function mockLead(page: Page, answers: number[]) {
  const sent: Lead[] = [];
  await page.route("**/api/lead", async (route: Route) => {
    sent.push(JSON.parse(route.request().postData() || "{}"));
    const status = answers[Math.min(sent.length - 1, answers.length - 1)];
    await route.fulfill({
      status,
      contentType: "application/json",
      body: JSON.stringify({ success: status === 200 }),
    });
  });
  return sent;
}

async function rejectCookies(page: Page) {
  await page
    .getByRole("button", { name: "Nicht notwendige ablehnen" })
    .first()
    .click({ timeout: 4000 })
    .catch(() => undefined);
}

test("first screen -> reference -> website request", async ({ page }) => {
  const sent = await mockLead(page, [502, 200]);
  await page.goto("/de/", { waitUntil: "networkidle" });
  await rejectCookies(page);

  // The first screen says what DEEV sells and offers the request.
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Eine Website, die aus Besuchern");
  await expect(page.getByRole("link", { name: /Projekt anfragen/ }).first()).toBeVisible();

  await page.locator("figure a[href$='/de/work/bureau-immobilier-feltes']").first().click();
  await expect(page).toHaveURL(/\/de\/work\/bureau-immobilier-feltes$/);

  await page.getByRole("link", { name: "Ähnliches Projekt anfragen" }).click();
  await expect(page).toHaveURL(/interest=website&ref=bureau-immobilier-feltes/);
  await expect(page.getByText("Ihre Anfrage bezieht sich auf")).toBeVisible();
  // The service choice is there, already on "Neue Website"; other services
  // can still be picked.
  await expect(page.getByLabel("Wobei können wir helfen?")).toHaveValue("website");

  await page.getByLabel("Name").fill("Test Person");
  await page.getByLabel("Geschäftliche E-Mail").fill("test@example.com");
  await page.getByLabel("Was soll Ihre neue Website können?").fill("Eine neue Website mit Terminanfragen.");
  await expect(page.getByLabel("Telefonnummer")).toHaveCount(0);
  await page.getByLabel("Bitte rufen Sie mich zurück").check();
  await page.getByLabel("Telefonnummer").fill("+352 000 000");

  const submit = page.getByRole("button", { name: "Projekt anfragen" });
  await submit.click();
  // First answer fails: an error, no success, the inputs stay.
  await expect(page.getByRole("alert")).toBeVisible();
  await expect(page.getByText("Nachricht erhalten.")).toHaveCount(0);
  await expect(page.getByLabel("Name")).toHaveValue("Test Person");

  await submit.click();
  await expect(page.getByText("Nachricht erhalten.")).toBeVisible();
  expect(sent).toHaveLength(2);
  expect(sent[1].request_id).toBe(sent[0].request_id);
  expect(sent[1].reference_project).toBe("Bureau Immobilier Feltes");
  expect(sent[1].interest).toBe("Neue Website");
  expect(sent[1].call_back).toBeTruthy();
});

test("price calculator -> anonymous estimate -> quote request", async ({ page }) => {
  const sent = await mockLead(page, [200]);
  await page.goto("/de/", { waitUntil: "networkidle" });
  await rejectCookies(page);

  const budget = page.getByRole("link", { name: "Was kostet meine Website?" }).first();
  await budget.scrollIntoViewIfNeeded();
  await budget.click();
  await expect(page).toHaveURL(/\/de\/project\?type=website$/);

  // Website is preselected; the calculator opens on the scope step.
  await expect(page.getByText("Welchen Umfang streben Sie an?")).toBeVisible();
  await page.locator("button[aria-pressed]").first().click();
  await page.getByRole("button", { name: "Weiter", exact: true }).click();
  await page.getByRole("button", { name: "Schätzung berechnen" }).click();

  // The full range without any contact details.
  await expect(page.getByText("Regulärer Projektpreis")).toBeVisible();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  expect(sent).toHaveLength(0);

  await page.getByRole("button", { name: "Persönliches Angebot zu dieser Konfiguration anfragen" }).click();
  const dialog = page.getByRole("dialog", { name: "Persönliches Angebot" });
  await expect(dialog.getByText("Ihre Konfiguration", { exact: true })).toBeVisible();
  await dialog.getByLabel(/Ihr Name/).fill("Test Person");
  await dialog.getByLabel(/Geschäftliche E-Mail/).fill("test@example.com");
  await dialog.getByRole("button", { name: "Angebot anfragen" }).click();
  // The dialog is named by its heading, which becomes the confirmation.
  await expect(page.getByRole("dialog", { name: "Anfrage erhalten." })).toBeVisible();

  expect(sent).toHaveLength(1);
  expect(sent[0].product).toBe("Firmenwebsite");
  expect(sent[0].estimate).toMatch(/^€[\d.]+ – €[\d.]+ \(gross\)$/);
});
