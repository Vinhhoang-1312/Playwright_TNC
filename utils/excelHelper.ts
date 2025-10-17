import * as XLSX from 'xlsx';
export function readExcelData(filePath: string, sheetName: string): any[] {
    const workbook = XLSX.readFile(filePath);
    const worksheet = workbook.Sheets[sheetName];
    return XLSX.utils.sheet_to_json(worksheet);
}
