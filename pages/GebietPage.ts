import { Page, expect } from '@playwright/test';

export class GebietePage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async goto() {
        
        await this.page.goto('https://localhost:3000/meineGebiete');
    }
    async expectAccessDenied() {
        await expect(this.page.getByText('Bitte einloggen.')).toBeVisible();
    }
    async expectGebietevisible(){
        await expect(this.page.getByTestId('gebiet-Web')).toBeVisible();
        await expect(this.page.getByTestId('gebiet-KI')).toBeVisible();
    }
    async addThema(themaTitel:string,beschreibung:string,abschluss:"bsc"|"msc"|"any"){
        await this.page.getByTestId('gebiet-Web').click();
        await expect(this.page.getByTestId('button-add-thema')).toBeVisible();
        await this.page.getByTestId('button-add-thema').click();
        await this.page.getByTestId('input-thema-titel').fill(themaTitel);
        await this.page.getByTestId('input-thema-beschreibung').fill(beschreibung);
        await this.page.getByTestId('select-abschluss').selectOption(abschluss);
        await this.page.getByTestId('button-thema-save').click();
    }
    async expectNewThemaVisible(themaTitel:string){
        await expect(this.page.getByTestId(`thema-titel-${themaTitel}`)).toBeVisible();
    }
    async deleteNewThema(themaTitel:string){
        await this.page.once('dialog', dialog => dialog.accept());
        await this.page.getByTestId(`button-${themaTitel}-delete`).click();  
    }
    async expectNewNotThemaVisible(themaTitel:string){
        await expect(this.page.getByTestId(`thema-titel${themaTitel}`)).not.toBeVisible();
    }
    async addNewGebiet(name:string){
        await this.page.getByTestId('button-add-gebiet').click();
        await this.page.getByTestId('input-gebiet-name').fill(name);
        await this.page.getByTestId('button-gebiet-save').click();

    }
    async expectGebietVisible(name:string){
        await expect(this.page.getByTestId(`gebiet-${name}`)).toBeVisible();

    }
    async deleteGebiet(name:string){
        await this.page.once('dialog', dialog => dialog.accept());
        await this.page.getByTestId(`button-delete-${name}`).click();  
    }
    async expectGebietNotVisible(name:string){
        await expect(this.page.getByTestId(`gebiet-${name}`)).not.toBeVisible();

    }
}