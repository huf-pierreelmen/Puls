import { expect, test } from "@playwright/test";

test("failed saves retain the form and dependent selectors clear child values", async ({ page }) => {
  await page.goto('/#projekt');
  await page.getByRole('button', { name: 'Nytt projekt' }).click();
  for (const [label, option] of [['AO', 'Stockholm City'], ['FO', 'City väst'], ['Fastighet', 'Hästen 19']]) {
    await page.getByRole('dialog').getByLabel(label, { exact: true }).click();
    await page.getByRole('option', { name: option, exact: true }).click();
  }
  await page.getByRole('dialog').getByLabel('AO', { exact: true }).click();
  await page.getByRole('option', { name: 'Göteborg', exact: true }).click();
  await expect(page.getByLabel('FO', { exact: true })).toContainText('Välj FO');
  await expect(page.getByLabel('Fastighet', { exact: true })).toBeDisabled();
  await page.getByRole('button', { name: 'Avbryt', exact: true }).click();
  await page.getByRole('link', { name: /Administration/ }).click();
  await page.getByRole('button', { name: 'Lägg till', exact: true }).click();
  await page.getByLabel('Namn', { exact: true }).fill('Sparfel');
  await page.evaluate(() => { Storage.prototype.setItem = () => { throw new Error('Test: lagringen är full'); }; });
  await page.getByRole('button', { name: 'Spara', exact: true }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.getByLabel('Namn', { exact: true })).toHaveValue('Sparfel');
  await expect(page.getByText('Kunde inte spara', { exact: true })).toBeVisible();
});

test("planning filters, project contributions, timeline and workload", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Planering", exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: /Jonas Berg, nov.*110/ }).click();
  await expect(page.getByRole("dialog")).toContainText("HGA UBS");
  await expect(page.getByRole("dialog")).toContainText("+10 % över kapacitet");
  await page.getByRole("button", { name: "Stäng", exact: true }).click();
  await page
    .getByRole("combobox", { name: "Filtrera Person", exact: true })
    .click();
  await page.getByRole("option", { name: "Karin Blom" }).click();
  await expect(
    page.getByRole("button", { name: /Karin Blom, nov.*0/ }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Rensa filter" }).click();
  await page.getByRole("tab", { name: "Tidslinje" }).click();
  await expect(
    page.getByRole("button", { name: /Jonas Berg, HGA UBS/ }).first(),
  ).toBeVisible();
  await page.getByRole("tab", { name: "Belastning", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Jonas Berg" })).toBeVisible();
  await page.screenshot({ path: "test-results/workload.png", fullPage: true });
  expect(errors).toEqual([]);
});

test("create, reload, edit and archive a project; administer and manually test sync", async ({
  page,
}) => {
  await page.goto("/#projekt");
  await page.getByRole("button", { name: "Nytt projekt" }).click();
  await page.getByRole("button", { name: "Nästa" }).click();
  await expect(page.getByRole("alert")).toContainText("Ange AO");
  for (const [label, option] of [
    ["AO", "Stockholm City"],
    ["FO", "City väst"],
    ["Fastighet", "Hästen 19"],
  ]) {
    await page.getByRole("dialog").getByLabel(label, { exact: true }).click();
    await page.getByRole("option", { name: option, exact: true }).click();
  }
  await page
    .getByLabel("Projektnamn", { exact: true })
    .fill("Testprojekt browser");
  await page.getByLabel("Projektnummer", { exact: true }).fill("BROWSER-001");
  await page.getByRole("button", { name: "Nästa" }).click();
  for (const [label, option] of [
    ["Status", "Pågående"],
    ["Projekttyp", "Underhåll"],
  ]) {
    await page.getByRole("dialog").getByLabel(label, { exact: true }).click();
    await page.getByRole("option", { name: option, exact: true }).click();
  }
  await page.getByRole("checkbox", { name: "Strategiskt" }).check();
  await page.getByRole("button", { name: "Nästa" }).click();
  await page
    .getByLabel("Lägg till intern projektledare", { exact: true })
    .click();
  await page.getByRole("option", { name: "Karin Blom" }).click();
  await page
    .getByLabel("Lägg till konsult (valfritt)", { exact: true })
    .click();
  await page.getByRole("option", { name: "Elin Norén" }).click();
  await page.getByRole("button", { name: "Nästa" }).click();
  await page
    .getByRole("button", { name: "Startdatum", exact: true })
    .first()
    .click();
  await expect(page.getByRole("grid")).toBeVisible();
  await page.getByRole("grid").getByRole("button").filter({ hasText: /^2$/ }).click();
  await expect(page.getByRole("button", { name: "Startdatum", exact: true }).first()).toContainText("2026-10-02");
  await page.getByLabel("Belastning (%)", { exact: true }).first().fill("150");
  await expect(page.getByRole("slider").first()).toHaveAttribute(
    "aria-valuenow",
    "150",
  );
  await page.getByLabel("Projektkommentar").fill("Samordna entreprenörer.");
  await page
    .getByRole("button", { name: "Spara projekt", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page.reload();
  await page.getByLabel("Sök projekt", { exact: true }).fill("BROWSER-001");
  await page
    .getByRole("button", { name: "Testprojekt browser", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toContainText("150 %");
  await expect(page.getByRole("dialog")).toContainText(
    "Samordna entreprenörer.",
  );
  await page
    .getByRole("button", { name: "Redigera projekt", exact: true })
    .click();
  await page
    .getByLabel("Projektnamn", { exact: true })
    .fill("Uppdaterat testprojekt");
  for (let i = 0; i < 3; i++)
    await page.getByRole("button", { name: "Nästa" }).click();
  await page.getByLabel("Belastning (%)", { exact: true }).first().fill("40");
  await page
    .getByRole("button", { name: "Spara projekt", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toContainText(
    "Uppdaterat testprojekt",
  );
  await page
    .getByRole("button", { name: "Arkivera projekt", exact: true })
    .click();
  await page.getByRole("button", { name: "Arkivera", exact: true }).click();
  await expect(page.getByRole("dialog")).toContainText("Arkiverat");
  await page.getByRole("button", { name: "Stäng", exact: true }).click();
  await expect(
    page.getByText("Inga projekt hittades.", { exact: false }),
  ).toBeVisible();
  await page.getByRole("link", { name: /Administration/ }).click();
  await page.getByRole("button", { name: "Lägg till", exact: true }).click();
  await page.getByLabel("Namn", { exact: true }).fill("Granskning");
  await page.getByRole("button", { name: "Spara", exact: true }).click();
  await expect(
    page.getByRole("cell", { name: "Granskning", exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Redigera Granskning" }).click();
  await page.getByRole("checkbox", { name: "Aktiv", exact: true }).uncheck();
  await page.getByRole("button", { name: "Spara", exact: true }).click();
  await expect(
    page.getByRole("row").filter({ hasText: "Granskning" }),
  ).toContainText("Inaktiv");
  await page.getByRole("tab", { name: "Masterdata", exact: true }).click();
  await page.getByRole("button", { name: "Synkronisera (test)" }).click();
  await expect(page.getByText(/Test klart/)).toBeVisible();
  await expect(
    page.getByText("Inte synkroniserad", { exact: true }),
  ).toBeVisible();
});

test("desktop overview and small screen navigation remain usable", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("button", { name: /Jonas Berg, nov/ }),
  ).toBeVisible();
  await page.screenshot({
    path: "test-results/planning-desktop.png",
    fullPage: true,
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("link", { name: /Resurser/ }).click();
  await page.getByRole("button", { name: "Karin Blom", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Karin Blom" })).toBeVisible();
  await page.screenshot({
    path: "test-results/planning-mobile.png",
    fullPage: true,
  });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});
