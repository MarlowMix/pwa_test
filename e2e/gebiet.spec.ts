import { test } from '@playwright/test';
import { GebietePage } from '../pages/GebietPage';
import { LoginModal } from '../pages/LoginModal';

const VALID_ID = '459810';
const VALID_PW = '123_abc_ABC';

test.describe('Gebiete & Themen Management', () => {

    test('Access Denied for Guests', async ({ page }) => {
        const gebietePage = new GebietePage(page);
        
        await gebietePage.goto();
        await gebietePage.expectAccessDenied();
    });

    test('CRUD Lifecycle for Gebiete and Themen', async ({ page }) => {
        const gebietePage = new GebietePage(page);
        const loginModal = new LoginModal(page);
        
        // Setup & Login
        await gebietePage.goto();
        await loginModal.login(VALID_ID, VALID_PW);
        await loginModal.expectLoggedIn();
        await gebietePage.expectGebietevisible(); 

        const testGebiet = `Gebiet + ${Date.now()}`.slice(-8);
        const testThema = `Thema + ${Date.now()}`.slice(-8);
        const testGebiet2 = `Gebiet2 + ${Date.now()}`.slice(-8);
        const testThema2 = `Thema2 + ${Date.now()}`.slice(-8);

        // 1. Create & Verify Gebiet
        await gebietePage.addNewGebiet(testGebiet);
        await gebietePage.expectGebietVisible(testGebiet);
        await gebietePage.expectGebietevisible(); 

        await gebietePage.editGebiet(testGebiet, testGebiet2);
        await gebietePage.expectGebietVisible(testGebiet2);
        
        // 2. Create & Verify Thema
        await gebietePage.addThema(testThema, 'Testen mit Playwright', 'bsc');
        await gebietePage.expectNewThemaVisible(testThema);

        await gebietePage.editThema(testThema, testThema2);
        await gebietePage.expectNewThemaVisible(testThema2);

        // 3. Delete & Verify Thema
        await gebietePage.deleteNewThema(testThema2);
        await gebietePage.expectNewNotThemaVisible(testThema2);

        // 4. Delete & Verify Gebiet
        await gebietePage.deleteGebiet(testGebiet2);
        await gebietePage.expectGebietNotVisible(testGebiet2);
    });
});