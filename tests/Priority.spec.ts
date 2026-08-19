import test from "@playwright/test"
import { LoginPage } from "../src/LoginPage"
import { PriorityPage } from "../src/PriorityPage"


test("Priority Test", async ({ page }) => {
    test.setTimeout(240000); // 4 min 
    const loginPage = new LoginPage(page);
    const priorityPage = new PriorityPage(page);

    await loginPage.navigateToLoginPage();
    await page.waitForTimeout(5000);
    await loginPage.enterOrgName("qastaging");
    await loginPage.clickSaveButton();
    await loginPage.clickLink();
    await loginPage.fillEmail("support@pcsinfinity.in");
    await loginPage.fillPassword("abc");
    await loginPage.signIn();
    await loginPage.dashbordforHeading();
    await priorityPage.navigateToPriority();
    await priorityPage.createButtonPriority();
    await priorityPage.fillPriority("PriorityAnshika006");
    //await priorityPage.selectTheCategory("Automation-Anshika");
    await priorityPage.selectAllCategoryClick();
    await priorityPage.saveButtonClick();
}
);