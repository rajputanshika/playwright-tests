import { Page, Locator } from '@playwright/test';

export class LoginPage {
    readonly page: Page;
    readonly orgname: Locator;
    readonly saveButton: Locator;

    constructor(Browserpage: Page) {
        this.page = Browserpage;
        this.orgname = Browserpage.locator('//input[@name="orgname"]');
        this.saveButton = Browserpage.locator('//button[@type="submit"]');

    }

    async navigateToLoginPage() {
        await this.page.goto('https://app-uat.assetinfinity.io/Login');
    }

    async enterOrgName(value: string) {
        await this.orgname.fill(value);
    }

    async clickSaveButton() {
        await this.saveButton.click();
    }
}