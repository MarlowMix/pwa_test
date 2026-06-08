import { Page, expect } from '@playwright/test';

export class AdminPage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async goto() {
        await this.page.goto('/admin');
    }

    async expectAccessDenied() {
        await expect(this.page.getByText('Zugriff verweigert')).toBeVisible();
    }

    async showAll() {
        await this.page.getByRole('button', { name: 'Alle anzeigen' }).click();
    }

    async createProf(name: string, campusID: string, password: string, isAdmin: boolean = false) {
        await this.page.getByTestId('btn-new-prof').click();
        await this.page.getByTestId('input-prof-name').fill(name);
        await this.page.getByTestId('input-prof-campusid').fill(campusID);
        await this.page.getByTestId('input-prof-password').fill(password);
        if (isAdmin) {
            await this.page.getByTestId('checkbox-prof-admin').check();
        }
        // 1. Starte einen Listener, der auf die API-Antwort WARTET
        const responsePromise = this.page.waitForResponse(response =>
            response.request().method() === 'POST'
        );
        // 2. Klicke auf Speichern (löst den Request aus)
        await this.page.getByTestId('btn-save-prof').click();

        // 3. Fange die Antwort auf, sobald sie kommt
        const response = await responsePromise;

        // 4. Prüfe den Status Code
        expect(response.status()).toBe(201);
    }

    async failCreateProf() {
        await this.page.getByTestId('btn-new-prof').click();
        await this.page.getByTestId('input-prof-name').fill(" ");
        await this.page.getByTestId('input-prof-campusid').fill("");
        await this.page.getByTestId('btn-save-prof').click();
        await expect(this.page.getByText('Name und CampusID dürfen nicht leer sein.')).toBeVisible(); // Passe diesen Text an deinen Error-State in ProfDialog.tsx an!
        await this.page.getByRole('button', { name: 'Abbrechen' }).click();
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