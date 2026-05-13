import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { AdminPage } from '../pages/AdminPage';
import { LoginModal } from '../pages/LoginModal';


// Testdaten für den Login
const ADMIN_ID = '459810';
const ADMIN_PW = '123_abc_ABC';

// Testdaten für den neuen Prof
const NEW_PROF_ID = `999${Date.now()}`.slice(-8);
const NEW_PROF_PW = 'testPasswort123!';

test.describe('User-Management (Professoren)', () => {

    
    test('Login, Anlage, Prüfung, Änderung und Löschung eines Users', async ({ page }) => {
        const loginModal = new LoginModal(page);
        const homePage = new HomePage(page);
        const adminPage = new AdminPage(page);

        // 1. Erfolgreicher Login als Administrator
        await homePage.goto();
        await loginModal.login(ADMIN_ID, ADMIN_PW);
        await loginModal.expectLoggedIn();

        // 2. Zur Admin-Seite navigieren
        await adminPage.goto();
        
        // Auflisten der User prüfen (Standard-User Moriarty muss da sein)
        await adminPage.showAll();
        await adminPage.expectProfExists(ADMIN_ID);

        // 3. Fehler-Zyklus: Anlegen ohne Pflichtfelder (Testet den Frontend-Validator)
        // Wir übergeben leere Strings, der Speichern-Button sollte den Dialog nicht schließen (und vermutlich eine Fehlermeldung zeigen)
        await adminPage.createProf('', '', '');
        await expect(page.getByText('Name und CampusID dürfen nicht leer sein.')).toBeVisible(); // Passe diesen Text an deinen Error-State in ProfDialog.tsx an!
        await page.getByRole('button', { name: 'Abbrechen' }).click(); // Dialog schließen, um sauber weiterzumachen

        // 4. Erfolgreiches Anlegen eines neuen Users
        await adminPage.createProf('Test Professor', NEW_PROF_ID, NEW_PROF_PW, false);
        
        // Prüfen, ob der neue User in der Liste auftaucht (liest die Seite neu aus / filtert)
        await adminPage.showAll();
        await adminPage.expectProfExists(NEW_PROF_ID);

        // 5. Rechte prüfen: Einloggen mit dem NEUEN (Nicht-Admin) User
        // Zuerst ausloggen
        await page.getByRole('button', { name: 'Logout' }).click();
        
        // Login mit dem neuen Prof
        await loginModal.login(NEW_PROF_ID, NEW_PROF_PW);
        await loginModal.expectLoggedIn();
        
        // Versuch, auf die Admin-Seite zu gehen
        await adminPage.goto();
        await adminPage.expectAccessDenied(); // Muss geblockt werden!

        // 6. Aufräumen: Wieder als Admin einloggen und den Test-User löschen
        await page.getByRole('button', { name: 'Logout' }).click();
        await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
        await loginModal.login(ADMIN_ID, ADMIN_PW);
        await loginModal.expectLoggedIn(); 

        await adminPage.goto();
        await adminPage.showAll();
        
        // Löscchen
        await adminPage.deleteProf(NEW_PROF_ID);
        // Prüfen, ob er weg ist
        await adminPage.expectProfDeleted(NEW_PROF_ID);
    });

});