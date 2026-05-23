import { test, expect } from '@playwright/test';

test('Iniciar sesión en Todo.ly', async ({ page }) => {
  // 1. Ir a la página
  await page.goto('https://todo.ly/');

  // 2. Click en el botón de Login (el que despliega el formulario)
  await page.click('a[href="javascript:ShowLogin();"]');

  // 3. Llenar el formulario
  // Nota: Asegúrate de que este usuario alberto123@gmail.com exista en Todo.ly
  await page.fill('#ctl00_MainContent_LoginControl1_TextBoxEmail', 'alberto123@gmail.com');
  await page.fill('#ctl00_MainContent_LoginControl1_TextBoxPassword', '12345');

  // 4. Click en el botón de Ingresar
  await page.click('#ctl00_MainContent_LoginControl1_ButtonLogin');

  // 5. Verificar que entramos
  // Esperamos a que el botón de Logout sea visible, eso confirma el éxito
  const logoutBtn = page.locator('#ctl00_HeaderTopControl1_LinkButtonLogout');
  await expect(logoutBtn).toBeVisible({ timeout: 10000 });

  console.log("¡Ya iniciamos sesión correctamente!");
  
  // Espera visual para que veas que funcionó antes de cerrar
  await page.waitForTimeout(3000);
});