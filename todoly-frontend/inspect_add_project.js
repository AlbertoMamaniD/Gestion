const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  console.log("Navigating to todo.ly...");
  await page.goto('https://todo.ly/');
  
  console.log("Logging in...");
  await page.click('a[href*="ShowLogin"]');
  await page.fill('#ctl00_MainContent_LoginControl1_TextBoxEmail', 'alberto123@gmail.com');
  await page.fill('#ctl00_MainContent_LoginControl1_TextBoxPassword', '12345');
  await page.click('#ctl00_MainContent_LoginControl1_ButtonLogin');
  
  console.log("Waiting for logout button...");
  await page.waitForSelector('#ctl00_HeaderTopControl1_LinkButtonLogout', { timeout: 15000 });
  console.log("Logged in successfully.");

  // Click Add New Project
  console.log("Clicking 'Add New Project'...");
  await page.click('div.AddProjectLiDiv[onclick*="ShowAddNewProject"]');
  
  // Wait for input
  await page.waitForSelector('#NewProjNameInput', { state: 'visible' });
  console.log("Input is visible. Value before fill:", await page.$eval('#NewProjNameInput', el => el.value));
  
  // Fill input
  const name = "ProjTemp_" + Date.now();
  await page.fill('#NewProjNameInput', name);
  console.log("Filled input with:", name);

  // Print button HTML
  const btnHTML = await page.$eval('#NewProjNameButton', el => el.outerHTML);
  console.log("Add button HTML:", btnHTML);

  // Click Add button
  console.log("Clicking Add button...");
  await page.click('#NewProjNameButton');

  // Wait a second
  await page.waitForTimeout(2000);

  // Check visibility of input
  const isInputVisible = await page.$eval('#NewProjNameInput', el => el.getBoundingClientRect().width > 0);
  console.log("Is input visible after 2s?", isInputVisible);

  // Check list
  const listHTML = await page.evaluate(() => {
    return document.querySelector('#ProjectsTable') ? document.querySelector('#ProjectsTable').outerHTML.substring(0, 1000) : "No #ProjectsTable";
  });
  console.log("Projects table snippet:", listHTML);

  await browser.close();
})();
