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

  async function inspect(step) {
    const visibleEditorCount = await page.locator('textarea.handsontableInput:visible').count();
    const editorInfo = visibleEditorCount > 0 ? await page.locator('textarea.handsontableInput:visible').first().evaluate(el => ({ value: el.value, outer: el.outerHTML.slice(0,200), class: el.className })) : null;
    const activeOuter = await page.evaluate(() => document.activeElement?.outerHTML?.slice(0,200));
    const rowCells = [];
    for (let i = 0; i < await cells.count(); i++) {
      const cell = cells.nth(i);
      rowCells.push({ idx: i, text: await cell.textContent(), html: await cell.innerHTML(), class: await cell.getAttribute('class') });
    }
    console.log(`--- ${step} ---`);
    console.log('visible editors', visibleEditorCount);
    console.log('editor info', editorInfo);
    console.log('active element', activeOuter);
    console.log('row cells', JSON.stringify(rowCells, null, 2));
  }

  await inspect('initial');

  const edits = [
    { idx: 0, value: 'Consumable item' },
    { idx: 2, value: '100' },
    { idx: 3, value: '2' }
  ];

  for (const edit of edits) {
    const cell = cells.nth(edit.idx);
    console.log(`\n--- editing cell ${edit.idx} value=${edit.value} ---`);
    await cell.scrollIntoViewIfNeeded();
    await cell.dblclick({ force: true });
    await page.waitForTimeout(500);
    await inspect(`after dblclick ${edit.idx}`);
    const editor = page.locator('textarea.handsontableInput:visible').first();
    await editor.waitFor({ state: 'visible', timeout: 5000 });
    console.log('editor before fill value', await editor.evaluate(el => el.value));
    await editor.fill(edit.value);
    console.log('editor after fill value', await editor.evaluate(el => el.value));
    await editor.press('Enter');
    await page.waitForTimeout(500);
    await inspect(`after commit ${edit.idx}`);
  }

  await browser.close();
})();
