import path from 'path';
import fs from 'fs';
import { readExcelData, listSheetNames, readFirstNonEmptySheet } from './excelHelper';
export type Row = {
    [key: string]: any;
};
export function loadDataFromExcel(relPath: string, sheet?: string): Row[] {
    const filePath = path.resolve(process.cwd(), relPath);
    if (!fs.existsSync(filePath)) return [];

    // If caller provided a sheet name and it exists, use it
    if (sheet) {
        const sheets = listSheetNames(filePath);
        if (sheets.includes(sheet)) {
            return readExcelData(filePath, sheet);
        }
    }

    // Try common sheet names
    const common = ['Login', 'Register', 'UserProfile', 'Search', 'Sheet1', 'Sheet'];
    const sheets = listSheetNames(filePath);
    for (const name of common) {
        if (sheets.includes(name)) {
            return readExcelData(filePath, name);
        }
    }

    // Fallback: read first non-empty sheet (returns rows or empty array)
    const fallback = readFirstNonEmptySheet(filePath);
    return fallback.rows || [];
}
export function loadJson(relPath: string): Row[] {
    const filePath = path.resolve(process.cwd(), relPath);
    if (!fs.existsSync(filePath))
        return [];
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}
export function forEachDataRow(rows: Row[], fn: (row: Row, idx: number) => void) {
    for (const [idx, row] of rows.entries())
        fn(row, idx);
}

export function getDataRows(excelRel: string, _jsonRel: string, sheet?: string, maxRows?: number): Row[] {
    const excelRows = loadDataFromExcel(excelRel, sheet);
    if (excelRows && excelRows.length > 0) {
        const first = excelRows.find(r => r && Object.keys(r).length > 0);
        if (first && (first.username || first.email || first.keyword)) {
            return typeof maxRows === 'number' ? excelRows.slice(0, maxRows) : excelRows;
        }
    }
    return [];
}
