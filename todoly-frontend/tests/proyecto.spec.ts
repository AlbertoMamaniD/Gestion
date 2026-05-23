import { test, expect } from '@playwright/test';
import { TodoLyPage } from '../TodoLyPage';

/**
 * Automatización del flujo de creación de proyecto en Todo.ly
 * Autor : Alberto Mamani
 * Prefijo de proyecto único para evitar colisiones con otros compañeros
 */
test('create a new project with 7 validations', async ({ page }) => {
    const todoLy = new TodoLyPage(page);
    const projectName = `AlbertoM_QA_${Date.now()}`;

    // ── PASO 1: Navegar a la página ──────────────────────────────────────────
    await test.step('Paso 1: Navegar a https://todo.ly/', async () => {
        await page.goto('https://todo.ly/');
    });

    // ── PASO 2: Abrir el formulario de Login ─────────────────────────────────
    await test.step('Paso 2: Abrir el formulario de Login', async () => {
        await todoLy.loginLink.waitFor({ state: 'visible' });
        await todoLy.loginLink.click();
    });

    // ── PASO 3: Introducir credenciales ─────────────────────────────────────
    await test.step('Paso 3: Introducir email y contraseña', async () => {
        await todoLy.emailInput.waitFor({ state: 'visible' });
        await todoLy.emailInput.fill('alberto123@gmail.com');
        await todoLy.passwordInput.fill('12345');
    });

    // ── PASO 4: Hacer clic en el botón de Ingresar ──────────────────────────
    await test.step('Paso 4: Hacer clic en el botón Ingresar (Login)', async () => {
        await todoLy.loginButton.click();
    });

    // ── ASSERT 1: Login exitoso — botón Logout visible ───────────────────────
    await test.step('Assert 1: Login exitoso — botón Logout debe ser visible', async () => {
        await expect(
            todoLy.logoutButton,
            'Tras el login, el botón Logout debe estar visible'
        ).toBeVisible({ timeout: 15_000 });
    });

    // ── ASSERT 2: La URL pertenece al dominio todo.ly ────────────────────────
    await test.step('Assert 2: La URL pertenece al dominio todo.ly', async () => {
        await expect(page, 'La URL debe contener "todo.ly"').toHaveURL(/.*todo\.ly.*/);
    });

    // ── ASSERT 3: Sidebar de Projects está visible ───────────────────────────
    await test.step('Assert 3: Sidebar de Projects está visible', async () => {
        await expect(
            todoLy.projectsSectionLabel,
            'El encabezado "Projects" debe estar visible en el sidebar'
        ).toBeVisible({ timeout: 10_000 });
    });

    // ── ASSERT 4: El proyecto NO existe antes de crearlo ─────────────────────
    await test.step('Assert 4: El proyecto no existe antes de crearlo', async () => {
        const proyectoAntes = page.locator('table.ProjItemTable td', { hasText: projectName });
        await expect(
            proyectoAntes,
            `"${projectName}" no debe existir en el sidebar todavía`
        ).not.toBeVisible();
    });

    // ── PASO 5: Hacer clic en "Add New Project" ──────────────────────────────
    await test.step('Paso 5: Hacer clic en "Add New Project"', async () => {
        await todoLy.addNewProjectBtn.waitFor({ state: 'visible', timeout: 10_000 });
        await todoLy.addNewProjectBtn.click();
    });

    // ── ASSERT 5: El formulario de nuevo proyecto se abre correctamente ───────
    await test.step('Assert 5: Formulario de nuevo proyecto se abre (input visible)', async () => {
        await expect(
            todoLy.projectNameInput,
            'El input #NewProjNameInput debe aparecer al abrir el formulario'
        ).toBeVisible({ timeout: 5_000 });
    });

    // ── PASO 6: Escribir el nombre del proyecto ──────────────────────────────
    await test.step(`Paso 6: Escribir nombre del proyecto: "${projectName}"`, async () => {
        await todoLy.projectNameInput.fill(projectName);
    });

    // ── PASO 7: Confirmar la creación del proyecto ───────────────────────────
    await test.step('Paso 7: Hacer clic en el botón Add para confirmar', async () => {
        await todoLy.addProjectConfirmBtn.waitFor({ state: 'visible', timeout: 5_000 });
        await todoLy.addProjectConfirmBtn.click();
    });

    // ── ASSERT 6: El proyecto aparece en el sidebar ──────────────────────────
    await test.step('Assert 6: El proyecto aparece en el sidebar tras crearlo', async () => {
        const proyectoEnLista = page
            .locator('table.ProjItemTable td', { hasText: projectName })
            .first();
        await expect(
            proyectoEnLista,
            `"${projectName}" debe aparecer en la barra lateral`
        ).toBeVisible({ timeout: 15_000 });
    });

    // ── PASO 8: Seleccionar el proyecto en el sidebar ────────────────────────
    await test.step('Paso 8: Seleccionar el proyecto en el sidebar', async () => {
        await todoLy.clickProjectInSidebar(projectName);
    });

    // ── ASSERT 7: Título central refleja el proyecto seleccionado ────────────
    await test.step('Assert 7: El título central (#CurrentProjectTitle) refleja el proyecto', async () => {
        await expect(
            todoLy.projectTitleLabel,
            `El título central debe mostrar "${projectName}"`
        ).toHaveText(projectName, { timeout: 10_000 });
    });

    console.log(`✅ Project "${projectName}" created and all 7 validations passed.`);
});