import { Page, Locator } from '@playwright/test';

export class TicketTypePage {
    readonly page: Page;

    readonly createButton: Locator;
    readonly fillTicketTypeName: Locator;
    //readonly fillCategoryName: Locator;
    //readonly assetCategoriesAllIcon: Locator;
    //readonly fillLocationName: Locator;
    //readonly assetLocationAllIcon: Locator;
    readonly saveButton: Locator;





    constructor(Browserpage: Page) {
        this.page = Browserpage;


        this.createButton = Browserpage.locator('//button[text()="Create"]');
        this.fillTicketTypeName = Browserpage.locator('//input[@name="ticketType"]');
        //this.fillCategoryName = Browserpage.locator("//label[text()='Equipment Type']/following::textarea[1]");
        //this.assetCategoriesAllIcon = Browserpage.locator(`xpath = //div[@data-control-id="100285"]//label[text() ="Asset Categories"]/following::a[@title="Select All"][1]`)
        //this.assetLocationAllIcon = Browserpage.locator(`xpath = //div[@data-control-id="100284"]//label[text() ="Asset Locations"]/following::a[@title="Select All"][1]`)
        this.saveButton = Browserpage.locator("//button[@type='submit'][6]");
    }


    async navigateToTicketType() {
        await this.page.goto('/TicketType', {
            waitUntil: 'domcontentloaded'
        });
    }

    async createTTButton() {
        await this.createButton.click();
    }


    async fillTicketType(value: string) {
        await this.fillTicketTypeName.fill(value);
    }

    /*
    async fillCategory(value: string) {
        await this.fillCategoryName.click();
        await this.page.waitForTimeout(5000);
        await this.fillCategoryName.fill('');  
        await this.page.waitForTimeout(5000);
        await this.fillCategoryName.fill(value);
        await this.page.waitForTimeout(5000);
        const option = this.page.locator(`//li[contains(text(),'${value}')]`);
        await option.waitFor({ state: 'visible' , timeout: 5000 });
        await option.click();
        
    }
async fillLocation(value: string) {
    await this.fillLocationName.click();
    await this.fillLocationName.fill('');
    await this.fillLocationName.fill(value);

    const option = this.page.locator(`//li[contains(text(),'${value}')]`);
    await option.waitFor({ state: 'visible' });
    await option.click();

}
    
   async selectAllAssetCategoriesIcon() {
    await this.assetCategoriesAllIcon.click();
}
    async selectAllAssetLocationIcon() {
        await this.assetLocationAllIcon.waitFor({ state: 'visible', timeout: 10000 });
        await this.assetLocationAllIcon.click();
    }
        */

    async saveButtonClick() {
        await this.saveButton.click();

    }
}