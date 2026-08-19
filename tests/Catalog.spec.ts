import test from "@playwright/test"
import { CatalogPage } from "../src/CatalogPage";
import { LoginPage } from "../src/LoginPage";


test("Catalog Test", async ({ page }) => {
    test.setTimeout(240000);
    const loginPage = new LoginPage(page);
    const catalogPage = new CatalogPage(page);

    await loginPage.navigateToLoginPage();
    await page.waitForTimeout(5000);
    await loginPage.enterOrgName("qastaging");
    await loginPage.clickSaveButton();
    await loginPage.clickLink();
    await loginPage.fillEmail("support@pcsinfinity.in");
    await loginPage.fillPassword("abc");
    await loginPage.signIn();
    await loginPage.dashbordforHeading();
    await catalogPage.navigateToCatalog();
    await page.waitForTimeout(5000);
    //await catalogPage.verifyCatalogHeading(); 
    await catalogPage.clickCreateCatalogButton();
    await page.waitForTimeout(8000);
    await catalogPage.fillTheCatalogType("Asset");
    await catalogPage.selectTheCategory("Automation-Anshika");
    await catalogPage.fillTheEquipmentName("Test Equipment-New");
    await catalogPage.selectTheMake("HP");
    await catalogPage.fillThePrice("2000");
    await catalogPage.fillTheModel("Model HP-001");
    await catalogPage.selectTheVendor("1 OEM");
    await catalogPage.fillTheDescription("This is a test description for the catalog item.");
    await catalogPage.selectEndDate();
    await catalogPage.clickSaveButton();
    await page.waitForTimeout(5000);
    await catalogPage.verifyCatalogInGrid("Asset", "Automation-Anshika", "Test Equipment-New");



});
