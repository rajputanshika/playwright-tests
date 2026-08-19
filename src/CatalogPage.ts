import { Page, Locator,expect } from '@playwright/test';

export class CatalogPage {
    readonly page: Page
    //readonly catalogHeading: Locator
    readonly createCatalogButton: Locator
    readonly fillCatalogType: Locator
    readonly selectCategory: Locator
    readonly fillEquipmentName: Locator
    readonly selectMake: Locator
    readonly Price: Locator
    readonly model: Locator
    readonly selectVendor: Locator
    readonly description: Locator
    readonly endDate: Locator
    readonly saveButton: Locator
     // Grid locators
    readonly typeFilter: Locator
readonly categoryFilter: Locator
readonly equipmentFilter: Locator

readonly filteredRows: Locator
    



    constructor(Browserpage: Page) {
        this.page = Browserpage
        //this.catalogHeading = Browserpage.locator('//h1[@class="page-heading" and text()= "List of Catalogs"]')
        this.createCatalogButton = Browserpage.locator('//button[text()="Create"]')
        this.fillCatalogType = Browserpage.locator("span[id^='select2-typeId-'][id$='-container']")
        this.selectCategory = Browserpage.locator("//textarea[@class='form-control form-control-solid treeview-input']")
        this.fillEquipmentName = Browserpage.locator("//input[@name='catalogAssetName']")
        this.selectMake = Browserpage.locator("span[id^='select2-brandId-'][id$='-container']")
        this.Price = Browserpage.locator("//input[@name='price']")
        this.model = Browserpage.locator("//input[@name='model']")
        this.selectVendor = Browserpage.locator("span[id^='select2-venderId-'][id$='-container']")
        this.description = Browserpage.locator("//input[@name='description']")
        this.endDate = Browserpage.locator("//input[@name='endDate']")
        this.saveButton = Browserpage.locator("(//span[@class='indicator-label'][normalize-space()='Save'])[5]");
         // Grid
        this.typeFilter = Browserpage.getByRole('textbox', {name: 'Type Filter Input'});
        this.categoryFilter = Browserpage.getByRole('textbox', {name: 'Category Name Filter Input'});
        this.equipmentFilter = Browserpage.getByRole('textbox', {name: 'Equipment Name Filter Input'});
        this.filteredRows = Browserpage.locator('.ag-center-cols-container .ag-row');
    }
    

    async navigateToCatalog() {
        await this.page.goto('/Catalog', {
            waitUntil: 'domcontentloaded'
        });
    }
    /*
    async verifyCatalogHeading() {
        return await this.catalogHeading.textContent();
    
    }*/

    async clickCreateCatalogButton() {
        await this.createCatalogButton.click();
    }

    async fillTheCatalogType(value: string) {

        // Click the Type dropdown
        await this.fillCatalogType.click();

        // Select2 search input
        const searchbox = this.page.locator(
            '.select2-container--open input[role="searchbox"]'
        );

        await searchbox.waitFor({
            state: 'visible',
            timeout: 5000
        });

        await searchbox.fill(value);

        // Find option only inside the opened dropdown
        const option = this.page.locator(
            '.select2-container--open .select2-results__option',
            { hasText: value }
        ).first();

        await option.waitFor({
            state: 'visible',
            timeout: 5000
        });

        await option.click();

    }

    async selectTheCategory(value: string) {
        await this.selectCategory.click();
        await this.selectCategory.fill('');
        await this.selectCategory.fill(value);
        await this.page.waitForTimeout(1000);

        const option = this.page
            .locator('.ag-row, .ag-cell, .treeview-item, li, div')
            .filter({ hasText: value })
            .first();

        if (await option.count() > 0) {
            await option.waitFor({ state: 'visible', timeout: 10000 }).catch(() => null);
            const visible = await option.isVisible().catch(() => false);
            if (visible) {
                await option.click({ force: true });
                return;
            }
        }

        const fallback = this.page.getByText(value, { exact: false }).first();
        await fallback.waitFor({ state: 'visible', timeout: 10000 });
        await fallback.click({ force: true });
    }

    async fillTheEquipmentName(value: string) {
        await this.fillEquipmentName.click();
        await this.fillEquipmentName.fill(value);
        await this.page.waitForTimeout(500);
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
    async fillThePrice(value: string) {
        await this.Price.click();
        await this.Price.fill(value);
        await this.page.waitForTimeout(500);
    }
    async fillTheModel(value: string) {
        await this.model.click();
        await this.model.fill(value);
        await this.page.waitForTimeout(500);
    }


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

    //grid verify

   async verifyCatalogInGrid(
    type: string,
    categoryName: string,
    equipmentName: string
) {
    // Fill Type filter
    await this.typeFilter.fill(type);

    // Fill Category Name filter
    await this.categoryFilter.fill(categoryName);

    // Fill Equipment Name filter
    await this.equipmentFilter.fill(equipmentName);

    // Get first filtered row
    const firstRow = this.filteredRows.first();

    await expect(firstRow).toBeVisible();

    // Assertion 1 - Type
    await expect(firstRow.locator('.ag-cell').nth(0))
        .toHaveText(type);

    // Assertion 2 - Category Name
    await expect(firstRow.locator('.ag-cell').nth(2))
        .toHaveText(categoryName);

    // Assertion 3 - Equipment Name
    await expect(firstRow.locator('.ag-cell').nth(3))
        .toHaveText(equipmentName);
};

}