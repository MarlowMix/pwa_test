import { test } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { LoginModal } from '../pages/LoginModal';

const VALID_ID = '459810';
const VALID_PW = '123_abc_ABC';

test.describe('Home Page & Login Flow', () => {

    test('Login Failed', async ({ page }) => {
        const homePage = new HomePage(page);
        const loginModal = new LoginModal(page);

        await homePage.goto();
        await loginModal.failLogin('invalidUser', 'wrongPassword');
        
    });

    test('Login Successful', async ({ page }) => {
        const homePage = new HomePage(page);
        const loginModal = new LoginModal(page);

        await homePage.goto();
        await loginModal.login(VALID_ID, VALID_PW);
        await loginModal.expectLoggedIn();
    });

    test('Public vs Private Visibility', async ({ page }) => {
        const homePage = new HomePage(page);
        const loginModal = new LoginModal(page);

        await homePage.goto();
        
        // Not logged in: Public visible, Private hidden
        await homePage.expectWebGebietVisible();
        await homePage.expectPrivateNotVisable();

        // Log in to reveal private content
        await loginModal.login(VALID_ID, VALID_PW);
        await loginModal.expectLoggedIn();
        
        // Logged in: Both visible
        await homePage.expectWebGebietVisible();
        await homePage.expectPrivateVisable();
        
        // Check accordion
        await homePage.openWebAccordion();
        await homePage.expectThemenVisible();
    });
});