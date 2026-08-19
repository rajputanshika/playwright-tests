const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto('https://app-dev.assetinfinity.io/Login');
  await page.waitForSelector('input[name="company"]', { state: 'visible', timeout: 60000 });
  await page.fill('input[name="company"]', 'qastaging');
  await page.click('//button[@type="submit"]');
  await page.waitForTimeout(3000);
  await page.click('//h5[@id="asset-infinity-login-button"]');
  await page.waitForSelector('#loginForm input[name="email"]', { state: 'visible', timeout: 60000 });
  await page.fill('#loginForm input[name="email"]', 'support@pcsinfinity.in');
  await page.fill('#loginForm input[name="password"]', 'abc');
  await page.click('#loginForm button[type="submit"]');
  await page.waitForSelector('.aside-menu', { timeout: 60000 }).catch(() => null);
  await page.goto('https://app-dev.assetinfinity.io/BillOfQuantities');
  await page.waitForSelector('.handsontable', { state: 'visible', timeout: 120000 });
  await page.waitForTimeout(5000);
  const row = page.locator('.handsontable .htCore tbody tr').nth(0);
  const cells = row.locator('td:not(.htRowHeader):not(.rowHeader)');
  const count = await cells.count();
  console.log('data cells count', count);
  for (let i = 0; i < count; i++) {
    const cell = cells.nth(i);
    const html = await cell.innerHTML();
    console.log(`cell ${i} class=${await cell.getAttribute('class')} text='${await cell.textContent()}' html='${html.replace(/\s+/g,' ').slice(0,180)}'`);
  }
  const equipmentCell = cells.nth(1);
  await equipmentCell.scrollIntoViewIfNeeded();
  await equipmentCell.click({ force: true });
  await page.waitForTimeout(1200);
  console.log('after click, active element:', await page.evaluate(() => document.activeElement?.outerHTML?.slice(0,300)));
  console.log('visible dropdown / overlay candidates:');
  const visibleCandidates = await page.evaluate(() => {
    const isVisible = el => {
      const style = window.getComputedStyle(el);
      return style.visibility !== 'hidden' && style.display !== 'none' && el.offsetWidth > 0 && el.offsetHeight > 0;
    };
    const candidates = Array.from(document.querySelectorAll('*'))
      .filter(el => isVisible(el) && /(dropdown|menu|list|option|overlay|popup|treeview|autocomplete|select)/i.test(el.className + ' ' + el.id + ' ' + el.localName));
    return candidates.slice(0,50).map(el => ({ tag: el.tagName, class: el.className, id: el.id, text: el.textContent?.trim().slice(0,120), outer: el.outerHTML.slice(0,240) }));
  });
  console.log(JSON.stringify(visibleCandidates, null, 2));
  await browser.close();
})();