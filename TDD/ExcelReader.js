const XLSX = require('xlsx');
const path = require('path');

const filePath = path.join(__dirname, 'TestData.xlsx');

function readExcel(className) {
    const workbook = XLSX.readFile(filePath);
    const sheet = workbook.Sheets['TestData'];
    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    const classIndex = rows.findIndex(row => row[0] === className);
    if (classIndex === -1) return [];

    const headers = rows[classIndex + 1];
    const data = [];
    for (let i = classIndex + 2; i < rows.length; i++) {
        if (!rows[i] || rows[i].length === 0) break;
        if (rows[i].length === 1) break;
        const obj = {};
        headers.forEach((key, col) => { obj[key] = rows[i][col]; });
        data.push(obj);
    }
    return data;
}

module.exports = { readExcel };
