import test from "@playwright/test"
import { LoginPage } from "../src/LoginPage"
import { BOQPage } from "../src/BOQPage"    

test("BOQ Test", async ({ page }) => {
    test.setTimeout(240000);
    const loginPage = new LoginPage(page);
    const boqPage = new BOQPage(page);

    await loginPage.navigateToLoginPage();
    await page.waitForTimeout(5000);
    await loginPage.enterOrgName("qastaging");
    await loginPage.clickSaveButton();
    await loginPage.clickLink();
    await loginPage.fillEmail("support@pcsinfinity.in");
    await loginPage.fillPassword("abc");
    await loginPage.signIn();
    await loginPage.dashbordforHeading();
    await boqPage.navigateToBOQ();
    await page.waitForTimeout(5000);
    await boqPage.verifyBOQHeading();
    await boqPage.fillBOQRow(0, {
        consumable: "Consumable item",
        equipmentType: "Automation-Anshika",
        price: "100",
        quantity: "2",
        hsnCode: "HSN123",
        description: "Description text",
        movableImmovable: "yes",
        expenseItemName: "Expense Item Name",
    });
});