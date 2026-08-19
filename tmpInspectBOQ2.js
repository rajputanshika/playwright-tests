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
  console.log('data cell count', await cells.count());
  for (let i = 0; i < await cells.count(); i++) {
    const cell = cells.nth(i);
    console.log('cell', i, await cell.getAttribute('class'), await cell.innerHTML());
  }
  for (const index of [2, 3]) {
    const cell = cells.nth(index);
    console.log('\n--- activating cell', index, '---');
    console.log('cell class', await cell.getAttribute('class'));
    await cell.scrollIntoViewIfNeeded();
    await cell.dblclick({ force: true });
    await page.waitForTimeout(1500);
    const active = await page.evaluate(() => document.activeElement.outerHTML.slice(0,200));
    console.log('active element', active);
    const inputs = await page.$$eval('textarea.handsontableInput, input.handsontableInput, textarea', els => els.map(el => ({ tag: el.tagName, visible: el.offsetParent !== null, outer: el.outerHTML.slice(0,200)})));
    console.log('inputs', JSON.stringify(inputs, null, 2));
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);
  }
  await browser.close();
})();
