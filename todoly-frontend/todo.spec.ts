import { test, expect } from '@playwright/test';
import { TodoLyPage } from './TodolyPage';

test('Flujo completo: Login y Creación de Proyecto', async ({ page }) => {
    const todoLy = new TodoLyPage(page);
    const nombreProyecto = 'Proyecto Playwright ' + Date.now();

    // --- PASO 1: Login ---
    await todoLy.login('alberto123@gmail.com', '12345');
    
    // ASSERT 1: Verificar que el botón de logout existe (Login exitoso)
    await expect(todoLy.logoutButton).toBeVisible();

    // --- PASO 2: Crear Proyecto ---
    await todoLy.createProject(nombreProyecto);

    // --- PASO 3: Validaciones (Asserts) ---
    
    // ASSERT 2: El título del proyecto actual debe ser el que creamos
    await expect(todoLy.projectTitleLabel).toHaveText(nombreProyecto);

    // ASSERT 3: Verificar que el proyecto aparece en la lista de la izquierda
    const proyectoEnLista = page.locator(`//td[contains(text(),"${nombreProyecto}")]`);
    await expect(proyectoEnLista).toBeVisible();

    // ASSERT 4: Verificar que la URL no cambió a una de error (sigue en la principal)
    await expect(page).toHaveURL(/.*todo.ly/);

    // ASSERT 5: Verificar que el input de creación se cerró/limpió
    await expect(todoLy.projectNameInput).not.toBeVisible();

    console.log("¡Todos los asserts pasaron con éxito!");
});