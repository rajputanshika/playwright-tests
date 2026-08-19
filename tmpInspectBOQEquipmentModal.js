const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto('https://app-dev.assetinfinity.io/Login');
  await page.fill('input[name="company"]', 'qastaging');
  await page.click('//button[@type="submit"]');
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
  const equipmentCell = cells.nth(1);
  await equipmentCell.scrollIntoViewIfNeeded();
  await equipmentCell.click({ force: true });
  await page.waitForTimeout(1200);
  const modal = page.locator('#treeview-modal');
  console.log('modal count', await modal.count());
  if (await modal.count() > 0) {
    console.log('modal visible', await modal.isVisible());
    console.log('modal outerHTML', await modal.first().evaluate(el => el.outerHTML.slice(0,1000)));
    const searchInputs = modal.locator('input, textarea').filter({ hasText: '' });
    console.log('search input count', await searchInputs.count());
    for (let i = 0; i < await searchInputs.count(); i++) {
      const input = searchInputs.nth(i);
      console.log('input', i, 'type', await input.getAttribute('type'), 'class', await input.getAttribute('class'), 'name', await input.getAttribute('name'), 'placeholder', await input.getAttribute('placeholder'));
    }
    const options = modal.locator('span, div, li, a').filter({ hasText: 'Automation-Anshika' });
    console.log('matching options count', await options.count());
    for (let i = 0; i < await options.count(); i++) {
      const opt = options.nth(i);
      console.log('option', i, await opt.evaluate(el => el.outerHTML.slice(0,240)));
    }
    const saveBtn = modal.locator('button:has-text("Save"), button:has-text("SAVE"), button:has-text("save")');
    console.log('modal save count', await saveBtn.count());
    if (await saveBtn.count() > 0) {
      console.log('save outer', await saveBtn.first().evaluate(el => el.outerHTML.slice(0,240)));
    }
  }
  await browser.close();
})();