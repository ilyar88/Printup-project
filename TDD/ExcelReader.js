const XLSX = require('xlsx');
const path = require('path');

const filePath = path.join(__dirname, 'TestData.xlsx');

// Reads test data from the 'TestData' sheet, grouped by class name.
// The sheet is structured as: [className] row, then a header row, then data rows.
// Returns an array of objects keyed by the headers for the matching class section.
function readExcel(className) {
    const workbook = XLSX.readFile(filePath);
    const sheet = workbook.Sheets['TestData'];
    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    // Find the row where the class name appears in column A
    const classIndex = rows.findIndex(row => row[0] === className);
    if (classIndex === -1) return [];

    // Row after the class name contains column headers for that section
    const headers = rows[classIndex + 1];
    const data = [];
    // Collect data rows until an empty or single-cell row signals the section's end
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
