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
  console.log('cells count', await cells.count());
  for (let i = 0; i < await cells.count(); i++) {
    const cell = cells.nth(i);
    console.log('cell', i, 'class', await cell.getAttribute('class'), 'text', await cell.textContent(), 'html', await cell.innerHTML().slice(0,160));
  }
  for (let i = 0; i < await cells.count(); i++) {
    const cell = cells.nth(i);
    console.log(`\n--- activate cell ${i} ---`);
    await cell.scrollIntoViewIfNeeded();
    await cell.dblclick({ force: true });
    await page.waitForTimeout(500);
    const editor = page.locator('textarea.handsontableInput:visible').first();
    console.log('visible editor count', await page.locator('textarea.handsontableInput:visible').count());
    if (await editor.count() > 0) {
      console.log('editor value', await editor.evaluate(el => el.value));
      console.log('editor outer', await editor.evaluate(el => el.outerHTML.slice(0,200)));
    }
    console.log('active element', await page.evaluate(() => document.activeElement?.outerHTML?.slice(0,200)));
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);
  }
  await browser.close();
})();
