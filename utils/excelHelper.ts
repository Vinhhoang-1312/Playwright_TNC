import * as XLSX from 'xlsx';

export function readExcelData(filePath: string, sheetName: string): any[] {
    const workbook = XLSX.readFile(filePath);
    const worksheet = workbook.Sheets[sheetName];
    if (!worksheet) return [];
    return XLSX.utils.sheet_to_json(worksheet);
}

export function listSheetNames(filePath: string): string[] {
    const workbook = XLSX.readFile(filePath);
    return workbook.SheetNames || [];
}

export function readFirstNonEmptySheet(filePath: string): { sheetName: string | null; rows: any[] } {
    const workbook = XLSX.readFile(filePath);
    const names = workbook.SheetNames || [];
    for (const name of names) {
        const sheet = workbook.Sheets[name];
        if (!sheet) continue;
        const rows = XLSX.utils.sheet_to_json(sheet);
        if (rows && rows.length > 0) return { sheetName: name, rows };
    }
    return { sheetName: null, rows: [] };
}
