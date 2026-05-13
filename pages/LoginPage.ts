import { Page, expect } from '@playwright/test';

export class LoginPage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async goto() {
        
        await this.page.goto('https://localhost:3000/');
    }

    async login(campusID: string, password: string) {
        // Klicke auf den Login-Button im Header
        await this.page.getByRole('button', { name: 'Login' }).click();
        
        // Fülle das Formular aus (nutzt die data-testid, die du vorhin vergeben hast)
        await this.page.getByTestId('input-login-campusid').fill(campusID);
        await this.page.getByTestId('input-login-password').fill(password);
        
        // Senden
        await this.page.getByTestId('btn-login-submit').click();
    }

    async expectLoggedIn() {
        // Prüfe, ob der Logout-Button existiert
        await expect(this.page.getByRole('button', { name: 'Logout' })).toBeVisible();
    }

    async expectLoginError() {
        
        await expect(this.page.getByText('Login fehlgeschlagen')).toBeVisible();
    }

    async expectPrivateNotVisable(){
        await expect(this.page.getByTestId('gebiet-KI')).not.toBeVisible();
    }
    async expectPrivateVisable(){
        await expect(this.page.getByTestId('gebiet-KI')).toBeVisible();
    }
    async expectWebGebietVisible(){
        await expect(this.page.getByTestId('gebiet-Web')).toBeVisible();
    }
    async openWebAccordion(){
        await this.page.getByTestId('gebiet-Web').click();
    }
    async expectThemenVisible(){
        await expect(this.page.getByTestId('thema-Entwicklung einer Lernplattform')).toBeVisible();
        await expect(this.page.getByTestId('thema-Entwicklung eines Online-Shops')).toBeVisible();
    }
}