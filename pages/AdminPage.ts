import { Page, expect } from '@playwright/test';

export class AdminPage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async goto() {
        await this.page.goto('https://localhost:3000/admin'); 
    }

    async expectAccessDenied() {
        await expect(this.page.getByText('Zugriff verweigert')).toBeVisible();
    }

    async showAll() {
        await this.page.getByRole('button', { name: 'Alle anzeigen' }).click();
    }

    async createProf(name: string, campusID: string, password?: string, isAdmin: boolean = false) {
        await this.page.getByTestId('btn-new-prof').click();
        
        await this.page.getByTestId('input-prof-name').fill(name);
        await this.page.getByTestId('input-prof-campusid').fill(campusID);
        
        if (password) {
            await this.page.getByTestId('input-prof-password').fill(password);
        }

        if (isAdmin) {
            await this.page.getByTestId('checkbox-prof-admin').check();
        }

        
        
        await this.page.getByTestId('btn-save-prof').click();

    }

    async expectProfExists(campusID: string) {
        await expect(this.page.getByTestId(`prof-row-${campusID}`)).toBeVisible();
    }

    async deleteProf(campusID: string) {
        // WICHTIG: Playwright muss den "window.confirm" Dialog automatisch akzeptieren
        this.page.once('dialog', dialog => dialog.accept());
        await this.page.getByTestId(`btn-delete-${campusID}`).click();
    }

    async expectProfDeleted(campusID: string) {
        await expect(this.page.getByTestId(`prof-row-${campusID}`)).not.toBeVisible();
    }
}