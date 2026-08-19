const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto('https://app-dev.assetinfinity.io/Login');
  await page.fill('input[name="company"]', 'qastaging');
  await page.click('//button[@type="submit"]');
  await page.click('//h5[@id="asset-infinity-login-button"]');
  await page.fill('#loginForm input[name="email"]', 'support@pcsinfinity.in');
  await page.fill('#loginForm input[name="password"]', 'abc');
  await page.click('#loginForm button[type="submit"]');
  await page.waitForLoadState('networkidle');
  await page.goto('https://app-dev.assetinfinity.io/BillOfQuantities');
  await page.waitForSelector('.handsontable', { state: 'visible', timeout: 60000 });
  await page.waitForTimeout(3000);
  const row = page.locator('.handsontable .htCore tbody tr').nth(0);
  const cells = row.locator('td:not(.htRowHeader):not(.rowHeader)');
  const edits = [
    { idx: 0, value: 'Consumable item' },
    { idx: 2, value: '100' },
    { idx: 3, value: '2' }
  ];
  for (const edit of edits) {
    const cell = cells.nth(edit.idx);
    console.log('--- editing', edit.idx, '---');
    await cell.scrollIntoViewIfNeeded();
    await cell.dblclick({ force: true });
    await page.waitForTimeout(500);
    const editor = page.locator('textarea.handsontableInput:visible').first();
    await editor.waitFor({ state: 'visible', timeout: 5000 });
    await editor.fill(edit.value);
    await editor.press('Enter');
    await page.waitForTimeout(500);
    if (await page.locator('textarea.handsontableInput:visible').count() > 0) {
      await page.keyboard.press('Escape');
      await page.waitForTimeout(200);
    }
    console.log('cell text', edit.idx, await cell.textContent());
  }
  const values = [];
  for (const edit of edits) {
    const cell = cells.nth(edit.idx);
    values.push({ idx: edit.idx, text: await cell.textContent(), html: await cell.innerHTML() });
  }
  console.log('final values', JSON.stringify(values, null, 2));
  await browser.close();
})();
