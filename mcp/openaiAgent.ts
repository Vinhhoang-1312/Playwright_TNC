import 'dotenv/config';
import OpenAI from 'openai';
import { autoFixLocator } from './locatorAutoFixer';

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
	baseURL: (() => {
		if (!process.env.OPENAI_API_BASE_URL) throw new Error('Missing OPENAI_API_BASE_URL in .env');
		return process.env.OPENAI_API_BASE_URL;
	})(),
});

// Gửi thông tin lỗi và DOM lên OpenAI để nhận đề xuất sửa locator
export async function suggestLocatorFix(errorMessage: string, domHtml: string, filePath?: string, oldLocator?: string) {
	//send
	const prompt = domHtml 

		? `Only output the XPath selector. Nothing else. Example: //input[@type='email'] or //input[@id='username']
Error: ${errorMessage}
HTML: ${domHtml.substring(0, 2000)}
Bad selector: ${oldLocator}
New selector:`
		: `Only output the XPath selector. Nothing else. Example: //input[@type='email'] or //input[@id='username']
Error: ${errorMessage}
Bad selector: ${oldLocator}
New selector:`;
  
	let suggestion: string | null = null;
	console.log('[OpenAI] Requesting locator suggestion from AI...');
	console.log('[OpenAI] DOM available:', domHtml ? 'Yes' : 'No (using heuristic)');
  
	try {
		if (!domHtml) {
			console.warn('[OpenAI] No DOM, cannot suggest locator.');
			return null;
		} else {
			// Có DOM, gọi AI với timeout 120s
			const timeoutPromise = new Promise<string | null>((_, reject) => 
				setTimeout(() => reject(new Error('AI request timeout after 120s')), 120000)
			);
			suggestion = await Promise.race([
				getLocatorSuggestionFromAI(prompt),
				timeoutPromise
			]);
			if (suggestion) {
				// Loại bỏ dấu ``` và khoảng trắng thừa
				suggestion = suggestion.replace(/```[a-zA-Z]*|```/g, '').trim();
				// Nếu suggestion có nhiều dòng, lấy dòng đầu tiên có // hoặc chứa input
				const lines = suggestion.split('\n').map(l => l.trim()).filter(Boolean);
				const best = lines.find(l => l.startsWith('//') || l.includes('input'));
				if (best) suggestion = best;
			}
			console.log('[OpenAI] AI suggestion received (cleaned):', suggestion);
		}
	} catch (err: any) {
		console.error('[OpenAI] API error:', err?.message || err);
		console.error('[OpenAI] Chi tiết lỗi:', JSON.stringify(err, null, 2));
		if (err?.status === 429 || (err?.message && err.message.includes('429'))) {
			console.warn('[OpenAI] Rate-limited or quota exceeded.');
		}
		// Nếu có DOM, fallback sang heuristic
		if (domHtml) {
			console.log('[OpenAI] Fallback to heuristic locator...');
			suggestion = getHeuristicLocator(domHtml, oldLocator || '');
			console.log('[OpenAI] Heuristic suggestion:', suggestion);
		} else {
			suggestion = null;
		}
	}
	if (suggestion && filePath && oldLocator) {
		console.log(`[OpenAI] Attempting to fix locator in file: ${filePath}`);
		autoFixLocator(filePath, oldLocator, suggestion);
	} else {
		console.warn('[OpenAI] No suggestion to apply or missing file/locator info');
	}
	return suggestion;
}

// Hàm chỉ gọi AI, không dính auto-fix
async function getLocatorSuggestionFromAI(prompt: string): Promise<string | null> {
	if (!process.env.OPENAI_MODEL) throw new Error('Missing OPENAI_MODEL in .env');
  
	console.log('[OpenAI] Calling AI model:', process.env.OPENAI_MODEL);
  
	const response = await openai.chat.completions.create({
		model: process.env.OPENAI_MODEL,
		messages: [
			{ role: 'system', content: 'Bạn là chuyên gia kiểm thử tự động, giúp đề xuất locator chính xác cho Playwright. Chỉ trả về selector, không giải thích thêm.' },
			{ role: 'user', content: prompt },
		],
		max_tokens: 100,
		temperature: 0.3, // Giảm creativity để có kết quả ổn định hơn
	});
  
	const content = response.choices?.[0]?.message?.content?.trim() ?? null;
	console.log('[OpenAI] Raw AI response:', content);
  
	return content;
}

// Hàm chỉ fallback heuristic, không dính auto-fix
function getHeuristicLocator(domHtml: string, oldLocator: string = ''): string | null {
	try {
		console.log('[Heuristic] Trying heuristic selector detection...');
		console.log('[Heuristic] Old locator:', oldLocator);
    
		// Nếu không có DOM, phân tích old locator để đoán locator mới
		if (!domHtml && oldLocator) {
			// Pattern: //input[@id='js-login-email-xyz'] → //input[@id='js-login-email']
			if (oldLocator.includes('js-login-email')) {
				const fixed = "//input[@id='js-login-email']";
				console.log('[Heuristic] Pattern-based fix:', fixed);
				return fixed;
			}
			if (oldLocator.includes('js-login-password')) {
				const fixed = "//input[@id='js-login-password']";
				console.log('[Heuristic] Pattern-based fix:', fixed);
				return fixed;
			}
			// Remove -xyz suffix
			const withoutSuffix = oldLocator.replace(/-xyz/g, '');
			if (withoutSuffix !== oldLocator) {
				console.log('[Heuristic] Removed -xyz suffix:', withoutSuffix);
				return withoutSuffix;
			}
		}
    
		// Nếu có DOM, ưu tiên tìm theo old locator pattern
		if (domHtml) {
			// Nếu old locator chứa password, tìm password trước
			if (oldLocator.toLowerCase().includes('password')) {
				const passwordSelector = findPasswordLikeSelector(domHtml);
				if (passwordSelector) {
					console.log('[Heuristic] Found password-like selector:', passwordSelector);
					return passwordSelector;
				}
			}
      
			// Nếu old locator chứa email/mail, tìm email trước
			if (oldLocator.toLowerCase().includes('email') || oldLocator.toLowerCase().includes('mail')) {
				const emailSelector = findEmailLikeSelector(domHtml);
				if (emailSelector) {
					console.log('[Heuristic] Found email-like selector:', emailSelector);
					return emailSelector;
				}
			}
      
			// Nếu old locator chứa button/submit/login, tìm button
			if (oldLocator.toLowerCase().includes('button') || oldLocator.toLowerCase().includes('submit') || oldLocator.toLowerCase().includes('login')) {
				const buttonSelector = findButtonLikeSelector(domHtml);
				if (buttonSelector) {
					console.log('[Heuristic] Found button-like selector:', buttonSelector);
					return buttonSelector;
				}
			}
      
			// Fallback: thử tìm theo thứ tự mặc định
			const emailSelector = findEmailLikeSelector(domHtml);
			if (emailSelector) {
				console.log('[Heuristic] Found email-like selector:', emailSelector);
				return emailSelector;
			}
      
			const passwordSelector = findPasswordLikeSelector(domHtml);
			if (passwordSelector) {
				console.log('[Heuristic] Found password-like selector:', passwordSelector);
				return passwordSelector;
			}
      
			const buttonSelector = findButtonLikeSelector(domHtml);
			if (buttonSelector) {
				console.log('[Heuristic] Found button-like selector:', buttonSelector);
				return buttonSelector;
			}
		}
    
	} catch (e) {
		console.error('[OpenAI][Fallback] heuristic failed:', e);
	}
	return null;
}

function findEmailLikeSelector(dom: string): string | null {
	if (!dom) return null;
  
	// Try to find input elements with id/name/placeholder containing 'email' or 'mail'
	const inputRegex = /<input[^>]*>/gi;
	let match: RegExpExecArray | null;
  
	while ((match = inputRegex.exec(dom)) !== null) {
		const inputHtml = match[0];
    
		// Extract id attribute
		const idMatch = /id=\s*['"]([^'"]+)['"]/i.exec(inputHtml);
		if (idMatch) {
			const idValue = idMatch[1];
			if (idValue.toLowerCase().includes('email') || idValue.toLowerCase().includes('mail')) {
				return `//input[@id='${idValue}']`;
			}
		}
    
		// Extract name attribute
		const nameMatch = /name=\s*['"]([^'"]+)['"]/i.exec(inputHtml);
		if (nameMatch) {
			const nameValue = nameMatch[1];
			if (nameValue.toLowerCase().includes('email') || nameValue.toLowerCase().includes('mail')) {
				return `//input[@name='${nameValue}']`;
			}
		}
    
		// Check type="email"
		if (/type=\s*['"]email['"]/i.test(inputHtml)) {
			return "//input[@type='email']";
		}
	}
  
	return null;
}

function findPasswordLikeSelector(dom: string): string | null {
	if (!dom) return null;
  
	const inputRegex = /<input[^>]*>/gi;
	let match: RegExpExecArray | null;
  
	while ((match = inputRegex.exec(dom)) !== null) {
		const inputHtml = match[0];
    
		// Extract id attribute
		const idMatch = /id=\s*['"]([^'"]+)['"]/i.exec(inputHtml);
		if (idMatch) {
			const idValue = idMatch[1];
			if (idValue.toLowerCase().includes('password') || idValue.toLowerCase().includes('pass')) {
				return `//input[@id='${idValue}']`;
			}
		}
    
		// Check type="password"
		if (/type=\s*['"]password['"]/i.test(inputHtml)) {
			return "//input[@type='password']";
		}
	}
  
	return null;
}

function findButtonLikeSelector(dom: string): string | null {
	if (!dom) return null;
  
	// Look for submit buttons or login buttons
	const buttonRegex = /<(button|a)[^>]*>(.*?)<\/(button|a)>/gi;
	let match: RegExpExecArray | null;
  
	while ((match = buttonRegex.exec(dom)) !== null) {
		const buttonHtml = match[0];
		const buttonText = match[2];
    
		// Check if button text contains login/submit keywords
		if (buttonText && (
			buttonText.toLowerCase().includes('login') ||
			buttonText.toLowerCase().includes('đăng nhập') ||
			buttonText.toLowerCase().includes('submit')
		)) {
			// Try to extract class
			const classMatch = /class=\s*['"]([^'"]+)['"]/i.exec(buttonHtml);
			if (classMatch) {
				const classValue = classMatch[1];
				return `//${match[1]}[@class='${classValue}']`;
			}
      
			// Fallback to text content
			return `//${match[1]}[contains(text(), '${buttonText.trim()}')]`;
		}
	}
  
	return null;
}
