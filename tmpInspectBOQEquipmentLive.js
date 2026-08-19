const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1200 } });
  await page.goto('https://app-dev.assetinfinity.io/Login', { waitUntil: 'domcontentloaded' });
  await page.fill('input[name="company"]', 'qastaging');
  await page.click('//button[@type="submit"]');
  await page.click('//h5[@id="asset-infinity-login-button"]');
  await page.waitForSelector('#loginForm input[name="email"]', { state: 'visible', timeout: 60000 });
  await page.fill('#loginForm input[name="email"]', 'support@pcsinfinity.in');
  await page.fill('#loginForm input[name="password"]', 'abc');
  await page.click('#loginForm button[type="submit"]');
  await page.waitForLoadState('networkidle');
  await page.goto('https://app-dev.assetinfinity.io/BillOfQuantities', { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('.handsontable', { state: 'visible', timeout: 120000 });
  await page.waitForTimeout(4000);

  const row = page.locator('.handsontable .htCore tbody tr').nth(0);
  const cells = row.locator('td:not(.htRowHeader):not(.rowHeader)');
  await cells.nth(1).scrollIntoViewIfNeeded();
  await cells.nth(1).click({ force: true });
  await page.waitForTimeout(1500);

  const modal = page.locator('#treeview-modal');
  console.log('modal count', await modal.count());
  if (await modal.count() > 0) {
    console.log('modal visible', await modal.isVisible());
    const allInputs = modal.locator('input, textarea, .treeview-input');
    const inputCount = await allInputs.count();
    console.log('inputCount', inputCount);
    for (let i = 0; i < inputCount; i++) {
      const el = allInputs.nth(i);
      const tag = await el.evaluate(e => e.tagName.toLowerCase());
      const cls = await el.getAttribute('class');
      const name = await el.getAttribute('name');
      const ph = await el.getAttribute('placeholder');
      const value = await el.inputValue();
      console.log('el', i, { tag, cls, name, ph, value });
    }

    const textEls = await modal.locator('span, div, li, a, label').allTextContents();
    console.log('texts', textEls.slice(0, 80));
  }

  const modal2 = page.locator('.modal, [role="dialog"], .treeview-container');
  console.log('dialog count', await modal2.count());
  if (await modal2.count() > 0) {
    for (let i = 0; i < Math.min(await modal2.count(), 5); i++) {
      const d = modal2.nth(i);
      console.log('dialog', i, 'visible', await d.isVisible(), 'text', (await d.textContent()).slice(0, 200));
    }
  }

  await browser.close();
})();
