import test from "@playwright/test"
import { QuotationPage} from "../src/QuotationPage";
import { LoginPage } from "../src/LoginPage";   


test("Quotation Test", async ({ page }) => {
    test.setTimeout(240000);
    const loginPage = new LoginPage(page);
    const quotationPage = new QuotationPage(page); 
    
    await loginPage.navigateToLoginPage();
    await page.waitForTimeout(5000);
    await loginPage.enterOrgName("qastaging");
    await loginPage.clickSaveButton();
    await loginPage.clickLink();
    await loginPage.fillEmail("support@pcsinfinity.in");
    await loginPage.fillPassword("abc");
    await loginPage.signIn();
    await loginPage.dashbordforHeading();
    await quotationPage.navigateToQuotation();
    await page.waitForTimeout(5000);
    //await quotationPage.verifyQuotationHeading();
    await quotationPage.selectTheVendor("1 OEM");
    await quotationPage.fillTheModel("Model HP-001")
    await quotationPage.selectTheMake("HP");
    await quotationPage.fillTheDescription("This is a test description for the quotation-001");
    await quotationPage.selectEndDate();
    await quotationPage.clickSaveButton();
    await page.waitForTimeout(5000);
    await quotationPage.verifyQuotationInGrid("This is a test description for the quotation-001");



});