import { Page, Locator } from '@playwright/test';

export class TodoLyPage {
    readonly page: Page;

    // --- Login ---
    readonly loginLink: Locator;
    readonly emailInput: Locator;
    readonly passwordInput: Locator;
    readonly loginButton: Locator;
    readonly logoutButton: Locator;

    // --- Sidebar / Proyectos ---
    readonly projectsSectionLabel: Locator;
    readonly addNewProjectBtn: Locator;
    readonly projectNameInput: Locator;
    readonly addProjectConfirmBtn: Locator;

    // --- Título central ---
    readonly projectTitleLabel: Locator;

    // --- Items ---
    readonly newItemInput: Locator;
    readonly newItemAddBtn: Locator;

    constructor(page: Page) {
        this.page = page;

        // Login
        this.loginLink = page.locator('a[href="javascript:ShowLogin();"]');
        this.emailInput = page.locator('#ctl00_MainContent_LoginControl1_TextBoxEmail');
        this.passwordInput = page.locator('#ctl00_MainContent_LoginControl1_TextBoxPassword');
        this.loginButton = page.locator('#ctl00_MainContent_LoginControl1_ButtonLogin');
        this.logoutButton = page.getByRole('link', { name: 'Logout' });

        // Sidebar
        this.projectsSectionLabel = page.locator('text=Projects').first();
        this.addNewProjectBtn = page.locator('div.AddProjectLiDiv[onclick*="ShowAddNewProject"]');
        this.projectNameInput = page.locator('#NewProjNameInput');
        this.addProjectConfirmBtn = page.locator('#NewProjNameButton');

        // Centro
        this.projectTitleLabel = page.locator('#CurrentProjectTitle');

        // Items
        this.newItemInput = page.locator('#NewItemContentInput');
        this.newItemAddBtn = page.locator('#NewItemAddButton');
    }

    /** Navega a la home y hace login */
    async login(email: string, password: string): Promise<void> {
        await this.page.goto('https://todo.ly/');
        await this.loginLink.waitFor({ state: 'visible' });
        await this.loginLink.click();
        await this.emailInput.waitFor({ state: 'visible' });
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
    }

    /** Abre el formulario de nuevo proyecto */
    async openNewProjectForm(): Promise<void> {
        await this.addNewProjectBtn.waitFor({ state: 'visible', timeout: 10_000 });
        await this.addNewProjectBtn.click();
        await this.projectNameInput.waitFor({ state: 'visible', timeout: 5_000 });
    }

    /** Rellena el nombre y confirma la creación */
    async submitNewProject(name: string): Promise<void> {
        await this.projectNameInput.fill(name);
        await this.addProjectConfirmBtn.waitFor({ state: 'visible', timeout: 5_000 });
        await this.addProjectConfirmBtn.click();
    }

    /** Clic en el proyecto de la barra lateral por su nombre */
    async clickProjectInSidebar(name: string): Promise<void> {
        const item = this.page.locator('table.ProjItemTable td', { hasText: name }).first();
        await item.waitFor({ state: 'visible', timeout: 10_000 });
        await item.click();
    }

    /** Agrega un nuevo item al proyecto seleccionado */
    async addNewItem(content: string): Promise<void> {
        await this.newItemInput.waitFor({ state: 'visible', timeout: 5_000 });
        await this.newItemInput.fill(content);
        await this.newItemAddBtn.waitFor({ state: 'visible', timeout: 5_000 });
        await this.newItemAddBtn.click();
    }
}