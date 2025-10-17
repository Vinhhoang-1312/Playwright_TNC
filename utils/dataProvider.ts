import path from 'path';
import fs from 'fs';
import { readExcelData } from './excelHelper';
export type Row = {
    [key: string]: any;
};
export function loadDataFromExcel(relPath: string, sheet = 'Sheet1'): Row[] {
    const filePath = path.resolve(process.cwd(), relPath);
    if (!fs.existsSync(filePath))
        return [];
    return readExcelData(filePath, sheet);
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

export function getDataRows(excelRel: string, jsonRel: string, sheet = 'Sheet1', maxRows?: number): Row[] {
    const excelRows = loadDataFromExcel(excelRel, sheet);
    // Validate that excelRows look like expected (have username/email keys)
    if (excelRows && excelRows.length > 0) {
        const first = excelRows.find(r => r && Object.keys(r).length > 0);
        if (first && (first.username || first.email)) {
            return typeof maxRows === 'number' ? excelRows.slice(0, maxRows) : excelRows;
        }
    }
    // fallback to JSON
    const jsonRows = loadJson(jsonRel);
    return typeof maxRows === 'number' ? jsonRows.slice(0, maxRows) : jsonRows;
}
