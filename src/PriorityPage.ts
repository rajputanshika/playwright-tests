import { Page, Locator, expect } from "@playwright/test"

export class PriorityPage {
    readonly page: Page
    readonly createButton: Locator
    readonly fillPriorityName: Locator
    //readonly fillCategoryName: Locator
    readonly selectAllCategory: Locator
    readonly saveButton: Locator

    constructor(Browserpage: Page) {
        this.page = Browserpage
        this.createButton = Browserpage.locator('//button[text()="Create"]')
        this.fillPriorityName = Browserpage.locator('//input[@name="priorityType"]')
        //this.fillCategoryName = Browserpage.locator('//label[text() = "Asset Categories"]/following::textarea[1]')
this.selectAllCategory=this.page.locator(`xpath = //div[@data-control-id="100285"]//label[text() ="Asset Categories"]/following::a[@title="Select All"][1]`)
        this.saveButton = Browserpage.locator(
            "(//span[@class='indicator-label' and normalize-space()='Save'])[5]"
        );
    }

    async navigateToPriority() {
        await this.page.goto('/Priority', {
            waitUntil: 'domcontentloaded'
        });
    }
    async createButtonPriority() {
        await this.createButton.click();
    }

    async fillPriority(value: string) {
        await this.fillPriorityName.fill(value);
    }
    
   
        


    async selectAllCategoryClick() {
        await this.selectAllCategory.waitFor({ state: 'visible', timeout: 2000 });
        await this.selectAllCategory.click();
        await this.selectAllCategory.click();

        await this.page.waitForTimeout(10000);
    }



    async saveButtonClick() {
        await this.saveButton.click();
        await this.page.waitForTimeout(5000);
    }
}