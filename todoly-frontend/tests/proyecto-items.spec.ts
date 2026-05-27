import { test, expect } from '@playwright/test';
import { TodoLyPage } from '../TodoLyPage';

/**
 * Automatización del flujo de creación de proyecto, adición de 3 items y logout en Todo.ly
 * Autor: Alberto Mamani Esteban
 * Implementa 20 aserciones clave para máxima robustez.
 */
test('inicio de sesion, crear proyecto, agregar 3 items, y logout con 20 asserts clave', async ({ page }) => {
    const todoLy = new TodoLyPage(page);
    const projectName = `ALBERTOMAMANI_QA_${Date.now()}`;

    // ── PASO 1: Navegar a la página principal ──────────────────────────────────────────
    await test.step('Paso 1: Navegar a https://todo.ly/', async () => {
        await page.goto('https://todo.ly/');
    });

    // ── ASSERTS 1 a 3: Página de inicio y Landing State ──────────────────────────────
    await test.step('Assert 1: Verificar que la URL inicial es la correcta', async () => {
        await expect(page, 'La URL inicial debe ser https://todo.ly/').toHaveURL('https://todo.ly/');
    });

    await test.step('Assert 2: Verificar que el título de la página contiene "Todo.ly"', async () => {
        await expect(page, 'El título de la pestaña debe ser "Todo.ly - Simple Todo List"').toHaveTitle(/.*Todo\.ly.*/);
    });

    await test.step('Assert 3: Verificar que el enlace de Login está visible en la página de inicio', async () => {
        await expect(todoLy.loginLink, 'El enlace "Login" debe estar visible para el usuario').toBeVisible();
    });

    // ── PASO 2: Abrir formulario de Login ──────────────────────────────────────────────
    await test.step('Paso 2: Abrir el formulario de Login', async () => {
        await todoLy.loginLink.click();
    });

    // ── ASSERTS 4 a 6: Interfaz del formulario de Login ────────────────────────────────
    await test.step('Assert 4: Verificar que el campo Email se muestra en el formulario', async () => {
        await expect(todoLy.emailInput, 'El input de correo debe ser visible tras abrir el formulario').toBeVisible({ timeout: 5_000 });
    });

    await test.step('Assert 5: Verificar que el campo Password se muestra en el formulario', async () => {
        await expect(todoLy.passwordInput, 'El input de contraseña debe ser visible tras abrir el formulario').toBeVisible({ timeout: 5_000 });
    });

    await test.step('Assert 6: Verificar que el botón de confirmación de Login está visible', async () => {
        await expect(todoLy.loginButton, 'El botón de ingresar debe ser visible en el formulario').toBeVisible({ timeout: 5_000 });
    });

    // ── PASO 3: Rellenar credenciales y hacer Login ───────────────────────────────────
    await test.step('Paso 3: Rellenar credenciales de usuario y hacer clic en ingresar', async () => {
        await todoLy.emailInput.fill('alberto123@gmail.com');
        await todoLy.passwordInput.fill('12345');
        await todoLy.loginButton.click();
    });

    // ── ASSERTS 7 a 10: Estado post-login exitoso ─────────────────────────────────────
    await test.step('Assert 7: Verificar que el botón Logout está visible (Login exitoso)', async () => {
        await expect(
            todoLy.logoutButton,
            'El botón de Logout debe estar visible una vez dentro de la aplicación'
        ).toBeVisible({ timeout: 15_000 });
    });

    await test.step('Assert 8: Verificar que la URL actual contiene "todo.ly"', async () => {
        await expect(page, 'La URL activa debe estar dentro del dominio todo.ly').toHaveURL(/.*todo\.ly.*/);
    });

    await test.step('Assert 9: Verificar que la sección lateral "Projects" está visible', async () => {
        await expect(
            todoLy.projectsSectionLabel,
            'La etiqueta "Projects" de la barra lateral debe estar visible'
        ).toBeVisible({ timeout: 10_000 });
    });

    await test.step('Assert 10: Verificar que la opción "Add New Project" está visible en el sidebar', async () => {
        await expect(
            todoLy.addNewProjectBtn,
            'El botón lateral "Add New Project" debe ser visible'
        ).toBeVisible({ timeout: 10_000 });
    });

    // ── ASSERTS 11: Proyecto inexistente antes de crearlo ─────────────────────────────
    await test.step('Assert 11: Verificar que el proyecto no existe antes de crearlo', async () => {
        const proyectoAntes = page.locator('table.ProjItemTable td', { hasText: projectName });
        await expect(proyectoAntes, 'El proyecto no debe existir antes de realizar el flujo de creación').not.toBeVisible();
    });

    // ── PASO 4: Abrir formulario de nuevo proyecto ────────────────────────────────────
    await test.step('Paso 4: Abrir formulario de nuevo proyecto', async () => {
        await todoLy.openNewProjectForm();
    });

    // ── ASSERTS 12 a 13: Formulario de creación de proyectos ──────────────────────────
    await test.step('Assert 12: Verificar que el input para el nombre del proyecto es visible', async () => {
        await expect(todoLy.projectNameInput, 'El campo de texto del proyecto debe estar visible').toBeVisible();
    });

    await test.step('Assert 13: Verificar que el botón de confirmación del proyecto es visible', async () => {
        await expect(todoLy.addProjectConfirmBtn, 'El botón de guardar proyecto debe estar visible').toBeVisible();
    });

    // ── PASO 5: Confirmar creación del proyecto ───────────────────────────────────────
    await test.step(`Paso 5: Escribir el nombre del proyecto: "${projectName}" y crearlo`, async () => {
        await todoLy.submitNewProject(projectName);
    });

    // ── ASSERTS 14 a 15: Proyecto creado y seleccionado exitosamente ─────────────────
    await test.step('Assert 14: Verificar que el proyecto aparece en la lista de la barra lateral', async () => {
        const proyectoEnLista = page.locator('table.ProjItemTable td', { hasText: projectName }).first();
        await expect(proyectoEnLista, 'El nuevo proyecto debe crearse y listarse en el sidebar').toBeVisible({ timeout: 15_000 });
    });

    await test.step('Paso 5.1: Seleccionar el proyecto creado para activarlo', async () => {
        await todoLy.clickProjectInSidebar(projectName);
    });

    await test.step('Assert 15: Verificar que el título central refleja el proyecto activo', async () => {
        await expect(
            todoLy.projectTitleLabel,
            'El título central de la interfaz debe coincidir exactamente con el nombre de nuestro proyecto'
        ).toHaveText(projectName, { timeout: 10_000 });
    });

    // ── ASSERTS 16 a 17: Elementos de entrada de items (tareas) ───────────────────────
    await test.step('Assert 16: Verificar que el input de tareas está visible', async () => {
        await expect(todoLy.newItemInput, 'El input de texto para agregar items debe estar visible').toBeVisible();
    });

    await test.step('Assert 17: Verificar que el botón para agregar tareas está visible', async () => {
        await expect(todoLy.newItemAddBtn, 'El botón de "Add" de tareas debe estar visible').toBeVisible();
    });

    // ── PASO 6: Agregar los 3 items ───────────────────────────────────────────────────
    await test.step('Paso 6: Agregar 3 items ("Alberto Mamani item 1", "Alberto Mamani item 2", "Alberto Mamani item 3") de forma sucesiva', async () => {
        await todoLy.addNewItem('Alberto Mamani item 1');
        await todoLy.addNewItem('Alberto Mamani item 2');
        await todoLy.addNewItem('Alberto Mamani item 3');
    });

    // ── ASSERT 18: Los 3 items son visibles en el panel central ───────────────────────
    await test.step('Assert 18: Verificar la existencia y visibilidad de los 3 items agregados', async () => {
        const item1 = page.locator('div.ItemContentDiv', { hasText: 'Alberto Mamani item 1' }).first();
        const item2 = page.locator('div.ItemContentDiv', { hasText: 'Alberto Mamani item 2' }).first();
        const item3 = page.locator('div.ItemContentDiv', { hasText: 'Alberto Mamani item 3' }).first();

        await expect(item1, 'El item "Alberto Mamani item 1" debe ser visible en el panel').toBeVisible({ timeout: 10_000 });
        await expect(item2, 'El item "Alberto Mamani item 2" debe ser visible en el panel').toBeVisible({ timeout: 10_000 });
        await expect(item3, 'El item "Alberto Mamani item 3" debe ser visible en the panel').toBeVisible({ timeout: 10_000 });
    });

    // ── PASO 7: Hacer Logout ──────────────────────────────────────────────────────────
    await test.step('Paso 7: Hacer clic en el botón de Logout', async () => {
        await todoLy.logoutButton.click();
    });

    // ── ASSERTS 19 a 20: Cierre de sesión exitoso y limpieza de sesión ────────────────
    await test.step('Assert 19: Verificar que la sesión cerró y el botón Login vuelve a ser visible', async () => {
        await expect(
            todoLy.loginLink,
            'El enlace de Login inicial debe volver a mostrarse tras el cierre de sesión'
        ).toBeVisible({ timeout: 10_000 });
    });

    await test.step('Assert 20: Verificar que el botón de Logout ya no está visible', async () => {
        await expect(
            todoLy.logoutButton,
            'El botón de Logout no debe estar visible tras haber cerrado sesión'
        ).not.toBeVisible({ timeout: 5_000 });
    });

    console.log(`✅ Flujo completado y validado con 20 aserciones clave para el proyecto "${projectName}".`);
});
