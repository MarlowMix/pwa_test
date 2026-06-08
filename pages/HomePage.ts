import { Page, expect } from '@playwright/test';

export class HomePage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async goto() {

        await this.page.goto('/');
    }

    async expectPrivateNotVisable() {
        await expect(this.page.getByTestId('gebiet-KI')).not.toBeVisible();
    }
    async expectPrivateVisable() {
        await expect(this.page.getByTestId('gebiet-KI')).toBeVisible();
    }
    async expectWebGebietVisible() {
        await expect(this.page.getByTestId('gebiet-Web')).toBeVisible();
    }
    async openWebAccordion() {
        await this.page.getByTestId('gebiet-Web').click();
    }
    async expectThemenVisible() {
        await expect(this.page.getByTestId('thema-Entwicklung einer Lernplattform')).toBeVisible();
        await expect(this.page.getByTestId('thema-Entwicklung eines Online-Shops')).toBeVisible();
    }
}