import { Page } from '@playwright/test';
import { BasePage } from './basePage';

export class HomePage extends BasePage {
    constructor(page: Page) {
        super(page);
        // Thiết lập đường dẫn file nguồn để AI biết sửa đúng file
        this.sourceFile = __filename;
    }
}
