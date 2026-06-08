import { Page, expect } from '@playwright/test';

export class GebietePage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async goto() {

        await this.page.goto('/meineGebiete');
    }
    async expectAccessDenied() {
        await expect(this.page.getByText('Bitte einloggen.')).toBeVisible();
    }
    async expectGebietevisible() {
        await expect(this.page.getByTestId('gebiet-Web')).toBeVisible();
        await expect(this.page.getByTestId('gebiet-KI')).toBeVisible();
    }
    async addThema(themaTitel: string, beschreibung: string, abschluss: "bsc" | "msc" | "any") {
        await expect(this.page.getByRole('dialog')).not.toBeVisible();
        await this.page.getByTestId('gebiet-Web').click();
        await expect(this.page.getByTestId('button-add-thema-Web')).toBeVisible();
        await this.page.getByTestId('button-add-thema-Web').click();
        await expect(this.page.getByRole('dialog')).toBeVisible();
        await this.page.getByTestId('input-thema-titel').fill(themaTitel);
        await this.page.getByTestId('input-thema-beschreibung').fill(beschreibung);
        await this.page.getByTestId('select-thema-abschluss').selectOption(abschluss);
        const responsePromise = this.page.waitForResponse(response =>
            response.request().method() === 'POST'
        );
        await this.page.getByTestId('button-thema-save').click();
        const response = await responsePromise;
        expect(response.status()).toBe(201);
        await expect(this.page.getByRole('dialog')).not.toBeVisible();
    }
    async expectNewThemaVisible(themaTitel: string) {
        await expect(this.page.getByTestId(`thema-titel-${themaTitel}`)).toBeVisible();
    }
    async expectNewNotThemaVisible(themaTitel: string) {
        await expect(this.page.getByTestId(`thema-titel${themaTitel}`)).not.toBeVisible();
    }
    async addNewGebiet(name: string) {
        await this.page.getByTestId('button-add-gebiet').click();
        await this.page.getByTestId('input-gebiet-name').fill(name);
        const responsePromise = this.page.waitForResponse(response =>
            response.request().method() === 'POST'
        );
        await this.page.getByTestId('button-gebiet-save').click();
        const response = await responsePromise;
        expect(response.status()).toBe(201);
        await expect(this.page.getByRole('dialog')).not.toBeVisible();
    }
    async expectGebietVisible(name: string) {
        await expect(this.page.getByTestId(`gebiet-${name}`)).toBeVisible();

    }
    async deleteGebiet(name: string) {
        this.page.once('dialog', dialog => dialog.accept());

        const responsePromise = this.page.waitForResponse(response =>
            response.request().method() === 'DELETE'
        );

        await this.page.getByTestId(`button-delete-${name}`).click();

        const response = await responsePromise;
        expect(response.status()).toBe(204);
    }

    async deleteNewThema(themaTitel: string) {
        this.page.once('dialog', dialog => dialog.accept());

        const responsePromise = this.page.waitForResponse(response =>
            response.request().method() === 'DELETE'
        );

        await this.page.getByTestId(`button-${themaTitel}-delete`).click();

        const response = await responsePromise;
        expect(response.status()).toBe(204);
    }
    async expectGebietNotVisible(name: string) {
        await expect(this.page.getByTestId(`gebiet-${name}`)).not.toBeVisible();

    }
    async editGebiet(oldName: string, newName: string) {
        // 1. Bearbeiten-Button des spezifischen Gebiets klicken
        await this.page.getByTestId(`button-edit-${oldName}`).click();

        // 2. Neuen Text eingeben
        await this.page.getByTestId('input-gebiet-name').fill(newName);

        // 3. Sniffer starten (Wartet auf PUT/PATCH für das Gebiet)
        const responsePromise = this.page.waitForResponse(response =>
            response.request().method() === 'PUT' // oder 'PATCH'
        );

        // 4. Speichern klicken
        await this.page.getByTestId('button-gebiet-save').click();

        // 5. Antwort abwarten und HTTP 200 (OK) prüfen
        const response = await responsePromise;
        expect(response.status()).toBe(200);
    }

    async editThema(oldTitel: string, newTitel: string) {
        // 1. Bearbeiten-Button des spezifischen Themas klicken
        await this.page.getByTestId(`button-${oldTitel}-edit`).click();
        // 2. Neuen Text eingeben
        await this.page.getByTestId('input-thema-titel').fill(newTitel);
        // 3. Sniffer starten
        const responsePromise = this.page.waitForResponse(response =>
            response.request().method() === 'PUT' // oder 'PATCH'
        );
        // 4. Speichern klicken
        await this.page.getByTestId('button-thema-save').click();
        // 5. Antwort abwarten und Status prüfen
        const response = await responsePromise;
        expect(response.status()).toBe(200);
    }

}