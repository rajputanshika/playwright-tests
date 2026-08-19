import test from "@playwright/test"
import { LoginPage } from "../src/LoginPage"//import login page class(nothing runs yet)
 // Import the TicketType page class
 import { TicketTypePage } from "../src/TicketTypePage";

test('Ticket Type', async ({ page }) => {//start with this
    test.setTimeout(240000); // 4 min
    const loginPage = new LoginPage(page);//create an object
    // Create an object for TicketType page`
    const ticketType = new TicketTypePage(page);

    //The constructor runs automatically when use 'new' from login.ts
    await loginPage.navigateToLoginPage();
    await page.waitForTimeout(5000);
    await loginPage.enterOrgName('qastaging');
    await loginPage.clickSaveButton();
    await loginPage.clickLink();
    await loginPage.fillEmail('support@pcsinfinity.in');
    await loginPage.fillPassword('abc');
    await loginPage.signIn();
    await loginPage.dashbordforHeading();
    await ticketType.navigateToTicketType();
    await ticketType.createTTButton();
    await ticketType.fillTicketType('Ticket Type-Anshika');
    //await ticketType.fillCategory('Automation_Anshika');
    //await ticketType.fillLocation('Automation_Anshika');  
   // await ticketType.selectAllAssetCategoriesIcon();
    //await ticketType.selectAllAssetLocationIcon();
    await ticketType.saveButtonClick(); 
}
);