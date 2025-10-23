import fs from 'fs';
import path from 'path';

// Interface for locator fixing strategy
export interface LocatorFixer {
	fixLocator(filePath: string, oldLocator: string, newLocator: string): void;
}

export class FileLocatorFixer implements LocatorFixer {
	private enableAutoFix: boolean;
	private dryRun: boolean;

	constructor(enableAutoFix: boolean, dryRun: boolean) {
		this.enableAutoFix = enableAutoFix;
		this.dryRun = dryRun;
	}

	fixLocator(filePath: string, oldLocator: string, newLocator: string): void {
		console.log(`[AutoFix] Đang cố gắng sửa file: ${filePath}`);
		if (!this.enableAutoFix) {
			console.log('[AutoFix] ENABLE_AUTO_FIX=false, chỉ log đề xuất, không sửa file.');
			console.log(`[AutoFix] Đề xuất mới: ${newLocator}`);
			return;
		}
		const absPath = path.isAbsolute(filePath) ? filePath : path.join(process.cwd(), filePath);
		if (!fs.existsSync(absPath)) {
			console.error(`[AutoFix] File không tồn tại: ${absPath}`);
			return;
		}
		const content = fs.readFileSync(absPath, 'utf8');
		if (!content.includes(oldLocator)) {
			console.warn(`[AutoFix] Không tìm thấy locator cũ trong file: ${oldLocator}`);
			// Thử tìm locator gần giống
			const regex = /js-login-email[^']*/g;
			const found = content.match(regex);
			if (found && found.length > 0) {
				console.warn(`[AutoFix] Tìm thấy locator gần giống: ${found[0]}`);
			}
			return;
		}
		const newContent = content.replace(oldLocator, newLocator);
		if (this.dryRun) {
			console.log('[AutoFix][DryRun] Sẽ thay thế:', oldLocator, '=>', newLocator, 'trong file', absPath);
			return;
		}
		fs.writeFileSync(absPath, newContent, 'utf8');
		console.log(`[AutoFix] ✅ Đã thay thế locator trong file ${absPath}:\n${oldLocator} => ${newLocator}`);
	}
}
