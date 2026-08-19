import {Page,Locator,expect} from "@playwright/test";

export class QuotationPage {
    readonly page: Page 
   // readonly quotationHeading: Locator  
    readonly selectVendor: Locator  
    readonly selectMake: Locator
    readonly selectModel: Locator
    readonly description: Locator
    readonly endDate: Locator  
    readonly saveButton: Locator  
     // Grid locators
   // readonly vendorFilter: Locator
   // readonly  makeFilter: Locator
    //readonly modelFilter: Locator
    readonly descriptionFilter: Locator
    readonly filteredRows: Locator

constructor(Browserpage: Page) {
    this.page = Browserpage;
    //this.quotationHeading = Browserpage.locator('//h1[@class="page-heading" and text()= "Add Quotations"]')
    this.selectVendor = Browserpage.locator("span[id^='select2-venderId-'][id$='-container']")
    this.selectMake = Browserpage.locator("span[id^='select2-brandId-'][id$='-container']")
    this.selectModel = Browserpage.locator("//input[@name ='model']")
    this.description = Browserpage.locator("//input[@name='description']")
    this.endDate = Browserpage.locator("//input[@name='endDate']")
    this.saveButton = Browserpage.locator("(//span[@class='indicator-label'][normalize-space()='Save'])[1]");
     // Grid
        //this.vendorFilter = Browserpage.getByRole('textbox', {name: 'Vendor Filter Input'});
        //this.makeFilter = Browserpage.getByRole('textbox', {name: 'Make Filter Input'});
        //this.modelFilter = Browserpage.getByRole('textbox', {name: 'Model Filter Input'});
        this.descriptionFilter = Browserpage.getByRole('textbox', {name: 'Description Filter Input'});
        this.filteredRows = Browserpage.locator('.ag-center-cols-container .ag-row');
}

async navigateToQuotation() {
    await this.page.goto('/AddQuotation', {
        waitUntil: 'domcontentloaded'
    }); 
}

/*
async verifyQuotationHeading() {
    return await this.quotationHeading.textContent();   
}
    */
async selectTheVendor(value: string) {
        // Open Vendor dropdown
        await this.selectVendor.click();

        // Select2 search box
        const searchbox = this.page.locator(
            '.select2-container--open input[role="searchbox"]'
        );

        await searchbox.waitFor({
            state: 'visible',
            timeout: 5000
        });

        await searchbox.fill(value);

        // Select searched Make
        const option = this.page.locator(
            '.select2-container--open li.select2-results__option',
            { hasText: value }
        ).first();

        await option.waitFor({
            state: 'visible',
            timeout: 5000
        });

        await option.click();
    }

async selectTheMake(value: string) {
        // Open Make dropdown
        await this.selectMake.click();

        // Select2 search box
        const searchbox = this.page.locator(
            '.select2-container--open input[role="searchbox"]'
        );

        await searchbox.waitFor({
            state: 'visible',
            timeout: 5000
        });

        await searchbox.fill(value);

        // Select searched Make
        const option = this.page.locator(
            '.select2-container--open li.select2-results__option',
            { hasText: value }
        ).first();

        await option.waitFor({
            state: 'visible',
            timeout: 5000
        });

        await option.click();


    }

 async fillTheModel(value: string) {
        await this.selectModel.click();
        await this.selectModel.fill(value);
        await this.page.waitForTimeout(500);
    }


    async fillTheDescription(value: string) {
        await this.description.click();
        await this.description.fill(value);
        await this.page.waitForTimeout(500);
    }

    
   

   private formatDateDDMMYYYY(date: Date): string {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();

        return `${day}/${month}/${year}`;
    }


    // End Date = Next Month (same day, always > start date)
    async selectEndDate(): Promise<void> {
        const today = new Date();

        const nextMonthDate = new Date(
            today.getFullYear(),
            today.getMonth() + 1,
            today.getDate()
        );

        const formattedDate = this.formatDateDDMMYYYY(nextMonthDate);

        await this.endDate.fill(formattedDate);

        console.log('End Date:', formattedDate);
    }

    async clickSaveButton() {
        await this.saveButton.click();
    }   
  async verifyQuotationInGrid(
    /*
    vendorFilterValue: string,
    modelFilterValue: string,
    makeFilterValue: string,
    */
    descriptionFilterValue: string
) {
    // Fill Type filter
   /* await this.vendorFilter.fill(vendorFilterValue);

    await this.makeFilter.fill(makeFilterValue);

    await this.modelFilter.fill(modelFilterValue);
    */
    
    await this.descriptionFilter.fill(descriptionFilterValue);

     const firstRow = this.page
        .getByRole('row')
        .filter({ hasText: descriptionFilterValue })
        .first();
    
    
        /*
        await expect(firstRow.locator('.ag-cell').nth(0))
            .toHaveText(vendorFilterValue);

            await expect(firstRow.locator('.ag-cell').nth(7))
            .toHaveText(makeFilterValue);

            await expect(firstRow.locator('.ag-cell').nth(6))
            .toHaveText(modelFilterValue);
*/
                await expect(firstRow).toBeVisible();

    // Verify Description
    await expect(firstRow).toContainText(descriptionFilterValue);

};
}
