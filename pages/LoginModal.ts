import { Page, expect } from '@playwright/test';

export class LoginModal {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async login(campusId: string, passwort: string) {
        // 1. Öffne das Modal über den globalen Login-Button (meist im Header)

        await this.page.getByRole('button', { name: 'Login' }).click();

        // 2. Stelle sicher, dass das Modal da ist
        const dialog = this.page.getByRole('dialog');
        await expect(dialog).toBeVisible();

        // 3. Fülle die Felder aus (Passe die Test-IDs an deine LoginDialog.tsx an!)
        await this.page.getByTestId('input-login-campusid').fill(campusId);
        await this.page.getByTestId('input-login-password').fill(passwort);

        // 4. Klicke auf den Bestätigen-Button im Modal
        await this.page.getByTestId('button-login-submit').click();

        // 5. WICHTIG: Warte, bis das Modal nach erfolgreichem Login verschwindet
        await expect(dialog).not.toBeVisible();
    }
    async failLogin(campusId: string, passwort: string) {


        await this.page.getByRole('button', { name: 'Login' }).click();


        const dialog = this.page.getByRole('dialog');
        await expect(dialog).toBeVisible();


        await this.page.getByTestId('input-login-campusid').fill(campusId);
        await this.page.getByTestId('input-login-password').fill(passwort);


        await this.page.getByTestId('button-login-submit').click();


        await expect(dialog).toBeVisible();
        await expect(this.page.getByText('Login fehlgeschlagen')).toBeVisible();
        await this.page.getByTestId('button-login-cancel').click();
        await expect(dialog).not.toBeVisible();
    }
    async expectLoggedIn() {
        // Prüfe, ob der Logout-Button existiert
        await expect(this.page.getByRole('button', { name: 'Logout' })).toBeVisible();
    }


}