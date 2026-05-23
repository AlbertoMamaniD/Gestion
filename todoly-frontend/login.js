const { chromium } = require('playwright');

(async () => {
  // 1. headless: false para ver la acción. slowMo para que no sea tan veloz.
  const browser = await chromium.launch({ headless: false, slowMo: 500 });
  const page = await browser.newPage();
  
  await page.goto('https://todo.ly/');

  // 2. Click en Login
  await page.click('a[href="javascript:ShowLogin();"]');

  // 3. Llenar datos
  await page.fill('#ctl00_MainContent_LoginControl1_TextBoxEmail', 'alberto123@gmail.com');
  await page.fill('#ctl00_MainContent_LoginControl1_TextBoxPassword', '12345');
  
  // 4. Click en Ingresar
  await page.click('#ctl00_MainContent_LoginControl1_ButtonLogin');

  // 5. EN LUGAR DE TIMEOUT: Esperar a que aparezca el botón de Logout
  // Esto confirma que el login fue exitoso.
  try {
    await page.waitForSelector('#ctl00_HeaderTopControl1_LinkButtonLogout', { timeout: 5000 });
    console.log("¡Login exitoso! Estamos dentro.");
  } catch (e) {
    console.log("Error: No se pudo verificar el login (posiblemente datos incorrectos).");
  }

  // Esperar un poco para que tú lo veas antes de cerrar
  await page.waitForTimeout(2000);
  await browser.close();
})();