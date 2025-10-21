import { LocatorFixer, FileLocatorFixer } from './locatorFixerStrategy';

// Cho phép inject strategy, mặc định dùng FileLocatorFixer
let locatorFixer: LocatorFixer | null = null;

export function setLocatorFixer(fixer: LocatorFixer) {
	locatorFixer = fixer;
}

export function autoFixLocator(filePath: string, oldLocator: string, newLocator: string) {
	if (!locatorFixer) {
		// Khởi tạo mặc định nếu chưa có
		const enableAutoFix = process.env.ENABLE_AUTO_FIX;
		const dryRun = process.env.AUTO_FIX_DRY_RUN;
		locatorFixer = new FileLocatorFixer(enableAutoFix === 'true', dryRun === 'true');
	}
	locatorFixer.fixLocator(filePath, oldLocator, newLocator);
}
