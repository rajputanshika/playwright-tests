import { Page, Locator } from '@playwright/test';

export class LoginPage {
    readonly page: Page;
    readonly orgname: Locator;
    readonly saveButton: Locator;
    readonly clickonLink: Locator;
    readonly email: Locator;
    readonly password: Locator;
    readonly signInButton: Locator;

    constructor(Browserpage: Page) {
        this.page = Browserpage;
        this.orgname = Browserpage.locator('//input[@name="company"]');
        this.saveButton = Browserpage.locator('//button[@type="submit"]');
        this.clickonLink = Browserpage.locator('//h5[@id="asset-infinity-login-button"]');
        this.email = Browserpage.locator('#loginForm input[name="email"]');
        this.password = Browserpage.locator('#loginForm input[name="password"]');
        this.signInButton = Browserpage.locator('#loginForm button[type="submit"]');

        
    }

async navigateToLoginPage() {
    await this.page.goto('https://app-uat.assetinfinity.io/Login', {
        waitUntil: 'commit',
        timeout: 60000
    });

    // Wait for actual login input instead of page load
    await this.page.locator('//input[@name="company"]').waitFor({
        state: 'visible',
        timeout: 60000
    });
}



    async enterOrgName(value: string) {
        await this.orgname.fill(value);
    }


    async clickSaveButton() {
        await this.saveButton.click();
    }

  async clickLink() {
        await this.clickonLink.click();
    }


     async fillEmail(value: string) {
        await this.email.fill(value);
    }

     async fillPassword(value: string) {
        await this.password.fill(value);
    }

     async signIn() {
        await this.signInButton.click();
    }
}