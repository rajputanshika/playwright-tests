import test from "@playwright/test"
import { LoginPage } from "../src/login"//import login page class(nothing runs yet)

test('Login test', async ({ page }) => {//start with this
    const loginPage = new LoginPage(page);//create an object
//The constructor runs automatically when use 'new' from login.ts
    await loginPage.navigateToLoginPage();
    await page.waitForTimeout(5000);
    await loginPage.enterOrgName('UAT');
    await loginPage.clickSaveButton();
});