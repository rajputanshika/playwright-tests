const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto('https://app-dev.assetinfinity.io/Login');
  await page.fill('input[name="company"]', 'qastaging');
  await page.click('//button[@type="submit"]');
  await page.waitForTimeout(2000);
  await page.click('//h5[@id="asset-infinity-login-button"]');
  await page.waitForSelector('#loginForm input[name="email"]', { state: 'visible', timeout: 60000 });
  await page.fill('#loginForm input[name="email"]', 'support@pcsinfinity.in');
  await page.fill('#loginForm input[name="password"]', 'abc');
  await page.click('#loginForm button[type="submit"]');
  await page.waitForLoadState('networkidle');
  await page.goto('https://app-dev.assetinfinity.io/BillOfQuantities');
  await page.waitForSelector('.handsontable', { state: 'visible', timeout: 120000 });
  await page.waitForTimeout(4000);

  const row = page.locator('.handsontable .htCore tbody tr').nth(0);
  const cells = row.locator('td:not(.htRowHeader):not(.rowHeader)');

  const before = await page.evaluate(() => {
    const visible = el => {
      const style = window.getComputedStyle(el);
      return style.visibility !== 'hidden' && style.display !== 'none' && el.offsetWidth > 0 && el.offsetHeight > 0;
    };
    return Array.from(document.querySelectorAll('*'))
      .filter(el => visible(el))
      .map(el => ({
        tag: el.tagName,
        id: el.id,
        class: el.className,
        text: el.textContent?.trim().slice(0,120),
        outer: el.outerHTML.slice(0,240)
      }));
  });
  console.log('before count', before.length);

  const equipmentCell = cells.nth(1);
  await equipmentCell.scrollIntoViewIfNeeded();
  await equipmentCell.click({ force: true });
  await page.waitForTimeout(1200);
  await page.screenshot({ path: 'dropdown-before-after.png' });

  const after = await page.evaluate(() => {
    const visible = el => {
      const style = window.getComputedStyle(el);
      return style.visibility !== 'hidden' && style.display !== 'none' && el.offsetWidth > 0 && el.offsetHeight > 0;
    };
    return Array.from(document.querySelectorAll('*'))
      .filter(el => visible(el))
      .map(el => ({
        tag: el.tagName,
        id: el.id,
        class: el.className,
        text: el.textContent?.trim().slice(0,120),
        outer: el.outerHTML.slice(0,240)
      }));
  });

  const beforeKeys = new Set(before.map((el, i) => `${el.tag}-${el.id}-${el.class}-${el.text}`));
  const diff = after.filter(el => !beforeKeys.has(`${el.tag}-${el.id}-${el.class}-${el.text}`));
  console.log('new visible elements count', diff.length);
  for (const [idx, el] of diff.entries()) {
    console.log('diff', idx, JSON.stringify(el, null, 2));
  }

  await browser.close();
})();