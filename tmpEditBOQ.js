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
  const dataCells = row.locator('td:not(.htRowHeader):not(.rowHeader)');
  for (const idx of [2, 3]) {
    const cell = dataCells.nth(idx);
    console.log('Editing cell index', idx, 'html', await cell.innerHTML());
    await cell.scrollIntoViewIfNeeded();
    await cell.dblclick({ force: true });
    await page.waitForTimeout(500);
    const editor = page.locator('textarea.handsontableInput:visible').first();
    await editor.waitFor({ state: 'visible', timeout: 5000 });
    await editor.fill(idx === 2 ? '100' : '2');
    await editor.press('Enter');
    await page.waitForTimeout(500);
    console.log('Post-edit active element', await page.evaluate(() => document.activeElement.outerHTML.slice(0,200)));
    console.log('editor count visible', await page.locator('textarea.handsontableInput:visible').count());
    console.log('cell text after edit', await cell.textContent());
  }
  const values = [];
  for (const idx of [2, 3]) {
    const cell = dataCells.nth(idx);
    values.push({ idx, text: await cell.textContent(), innerHTML: await cell.innerHTML() });
  }
  console.log('final values', JSON.stringify(values, null, 2));
  await browser.close();
})();
