import { expect, Locator, Page } from '@playwright/test';

export interface BOQRowData {
    consumable: string;
    equipmentType: string;
    price: string;
    quantity: string;
    hsnCode: string;
    description: string;
    movableImmovable: string;
    expenseItemName: string;
}

export class BOQPage {
    readonly page: Page;

    // BOQ Handsontable
    readonly boqTable: Locator;

    // BOQ heading
    readonly boqHeading: Locator;

    // Save button
    readonly saveButton: Locator;

    constructor(page: Page) {
        this.page = page;

        /*
         * There are multiple grids on this page.
         * The first .ht_master is the BOQ HOT grid.
         */
        this.boqTable = page
            .locator('.handsontable.ht_master')
            .first();

        this.boqHeading = page
            .getByRole('heading', {
                name: /Bill\s*Of\s*Quantities\s*\(BOQ\)/i
            })
            .first();

        this.saveButton = page
            .getByRole('button', {
                name: /Save/i
            })
            .first();
    }

    // =========================================================
    // NAVIGATION
    // =========================================================

    async navigateToBOQ() {
        await this.page.goto('/BillOfQuantities', {
            waitUntil: 'domcontentloaded'
        });

        await this.waitForBOQ();
    }

    // =========================================================
    // WAIT FOR BOQ
    // =========================================================

    async waitForBOQ() {
        await expect(this.boqHeading).toBeVisible({
            timeout: 30000
        });

        await expect(this.boqTable).toBeVisible({
            timeout: 30000
        });
    }

    // =========================================================
    // VERIFY BOQ HEADING
    // =========================================================

    async verifyBOQHeading() {
        await expect(this.boqHeading).toBeVisible({
            timeout: 10000
        });

        return (
            (await this.boqHeading.textContent())?.trim() || ''
        );
    }

    // =========================================================
    // GET BOQ ROWS
    // =========================================================

    private getBOQRows(): Locator {
        return this.boqTable.locator(
            'tbody tr'
        );
    }

    // =========================================================
    // GET BOQ ROW
    // =========================================================

    private getBOQRow(row: number): Locator {
        return this.getBOQRows().nth(row);
    }

    // =========================================================
    // GET BOQ CELL
    // =========================================================
    /*
     * Column mapping:
     *
     * 0 = Consumable
     * 1 = Equipment Type
     * 2 = Price
     * 3 = Quantity
     * 4 = HSN Code
     * 5 = Description
     * 6 = Movable / Immovable
     * 7 = Expense Item Name - Finance
     * 8 = Expense Item Code - Finance
     *
     * The row header <th> is excluded because we use td.
     */

    private getCell(
        row: number,
        column: number
    ): Locator {
        return this.getBOQRow(row)
            .locator('td')
            .nth(column);
    }

    // =========================================================
    // GET HANDSONTABLE EDITOR
    // =========================================================

    private getEditor(): Locator {
        return this.page
            .locator(
                [
                    'textarea.handsontableInput',
                    'input.handsontableInput',
                    'textarea.htInput',
                    'input.htInput'
                ].join(', ')
            )
            .first();
    }

    // =========================================================
    // VERIFY ROW
    // =========================================================

    private async verifyRow(row: number) {
        const rowLocator = this.getBOQRow(row);

        await expect(rowLocator).toBeVisible({
            timeout: 10000
        });
    }

    // =========================================================
    // EDIT NORMAL CELL
    // =========================================================

    async editCell(
        row: number,
        column: number,
        value: string
    ) {
        const text = String(value);

        await this.verifyRow(row);

        const cell = this.getCell(
            row,
            column
        );

        await expect(cell).toBeVisible({
            timeout: 10000
        });

        await cell.scrollIntoViewIfNeeded();

        /*
         * Click the Handsontable cell.
         */
        await cell.click();

        /*
         * Open Handsontable editor.
         */
        await this.page.keyboard.press('F2');

        const editor = this.getEditor();

        await expect(editor).toBeVisible({
            timeout: 5000
        });

        /*
         * Clear existing value and enter new value.
         */
        await editor.fill(text);

        /*
         * ENTER commits the Handsontable value.
         *
         * IMPORTANT:
         * Do NOT wait for editor to become hidden.
         * Handsontable keeps the editor element visible.
         */
        await this.page.keyboard.press('Enter');

        /*
         * Verify the value was committed to the cell.
         */
        await expect(cell).toContainText(
            text,
            {
                timeout: 10000
            }
        );
    }

    // =========================================================
    // SELECT DROPDOWN VALUE
    // =========================================================

    async selectCellValue(
        row: number,
        column: number,
        value: string
    ) {
        await this.verifyRow(row);

        const cell = this.getCell(
            row,
            column
        );

        await expect(cell).toBeVisible({
            timeout: 10000
        });

        await cell.scrollIntoViewIfNeeded();

        /*
         * Click the dropdown cell.
         */
        await cell.click();

        /*
         * Some dropdowns open a search input.
         */
        const searchInput = this.page
            .locator(
                [
                    'input[placeholder="Search"]:visible',
                    'input[aria-label="Search"]:visible',
                    'textarea[placeholder="Search"]:visible',
                    '.treeview-input:visible'
                ].join(', ')
            )
            .first();

        const searchVisible =
            await searchInput.isVisible().catch(() => false);

        if (searchVisible) {
            /*
             * Search for requested value.
             */
            await searchInput.fill(value);

            /*
             * Select matching option.
             */
            const option = this.page
                .getByText(value, {
                    exact: true
                })
                .last();

            await expect(option).toBeVisible({
                timeout: 10000
            });

            await option.click();
        } else {
            /*
             * Dropdown without search.
             */
            const option = this.page
                .getByText(value, {
                    exact: true
                })
                .last();

            await expect(option).toBeVisible({
                timeout: 10000
            });

            await option.click();
        }

        /*
         * Verify selected value.
         */
        await expect(cell).toContainText(
            value,
            {
                timeout: 10000
            }
        );
    }

    // =========================================================
    // FILL ONE BOQ ROW
    // =========================================================

    async fillBOQRow(
        row: number,
        data: BOQRowData
    ) {
        /*
         * 0 - Consumable
         */
        await this.editCell(
            row,
            0,
            data.consumable
        );

        /*
         * 1 - Equipment Type
         */
        await this.selectCellValue(
            row,
            1,
            data.equipmentType
        );

        /*
         * 2 - Price
         */
        await this.editCell(
            row,
            2,
            data.price
        );

        /*
         * 3 - Quantity
         */
        await this.editCell(
            row,
            3,
            data.quantity
        );

        /*
         * 4 - HSN Code
         */
        await this.editCell(
            row,
            4,
            data.hsnCode
        );

        /*
         * 5 - Description
         */
        await this.editCell(
            row,
            5,
            data.description
        );

        /*
         * 6 - Movable / Immovable
         */
        await this.selectCellValue(
            row,
            6,
            data.movableImmovable
        );

        /*
         * 7 - Expense Item Name - Finance
         */
        await this.editCell(
            row,
            7,
            data.expenseItemName
        );
    }

    // =========================================================
    // FILL MULTIPLE BOQ ROWS
    // =========================================================

    async fillBOQRows(
        rows: BOQRowData[]
    ) {
        for (let i = 0; i < rows.length; i++) {
            await this.fillBOQRow(
                i,
                rows[i]
            );
        }
    }

    // =========================================================
    // GET CELL VALUE
    // =========================================================

    async getCellValue(
        row: number,
        column: number
    ): Promise<string> {
        const cell = this.getCell(
            row,
            column
        );

        await expect(cell).toBeVisible({
            timeout: 10000
        });

        return (
            (await cell.textContent())?.trim() || ''
        );
    }

    // =========================================================
    // VERIFY CELL VALUE
    // =========================================================

    async verifyCellValue(
        row: number,
        column: number,
        expectedValue: string
    ) {
        const cell = this.getCell(
            row,
            column
        );

        await expect(cell).toBeVisible({
            timeout: 10000
        });

        await expect(cell).toContainText(
            expectedValue,
            {
                timeout: 10000
            }
        );
    }

    // =========================================================
    // VERIFY COMPLETE BOQ ROW
    // =========================================================

    async verifyBOQRow(
        row: number,
        data: BOQRowData
    ) {
        await this.verifyCellValue(
            row,
            0,
            data.consumable
        );

        await this.verifyCellValue(
            row,
            1,
            data.equipmentType
        );

        await this.verifyCellValue(
            row,
            2,
            data.price
        );

        await this.verifyCellValue(
            row,
            3,
            data.quantity
        );

        await this.verifyCellValue(
            row,
            4,
            data.hsnCode
        );

        await this.verifyCellValue(
            row,
            5,
            data.description
        );

        await this.verifyCellValue(
            row,
            6,
            data.movableImmovable
        );

        await this.verifyCellValue(
            row,
            7,
            data.expenseItemName
        );
    }

    // =========================================================
    // SAVE BOQ
    // =========================================================

    async saveBOQ() {
        await expect(this.saveButton).toBeVisible({
            timeout: 10000
        });

        await expect(this.saveButton).toBeEnabled();

        await this.saveButton.click();
    }
}
