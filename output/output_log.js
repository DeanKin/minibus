const fs = require('fs');
const path = require('path');
const { Parser } = require('json2csv');

// Get current date in YYYY-MM-DD format
const getCurrentDate = () => {
    const now = new Date();
    return [
        now.getFullYear(),
        String(now.getMonth() + 1).padStart(2, '0'),
        String(now.getDate()).padStart(2, '0')
    ].join('-');
};

// Path configuration
const jsonFilePath = 'button_logs.json';
const exportDir = 'export';

try {
    // 1. Read JSON file
    const jsonData = fs.readFileSync(jsonFilePath, 'utf8');
    const data = JSON.parse(jsonData);

    // 2. Convert to CSV
    const parser = new Parser();
    const csv = parser.parse(data);

    // 3. Ensure export directory exists
    if (!fs.existsSync(exportDir)) {
        fs.mkdirSync(exportDir);
        console.log(`Created directory: ${exportDir}`);
    }

    // 4. Generate output path
    const outputFilename = `${getCurrentDate()}_car_record.csv`;
    const outputPath = path.join(exportDir, outputFilename);

    // 5. Save CSV
    fs.writeFileSync(outputPath, csv);
    console.log(`CSV successfully exported to: ${outputPath}`);

    // 6. Clear the JSON file (set to empty array)
    fs.writeFileSync(jsonFilePath, JSON.stringify([], null, 2));
    console.log(`Cleared JSON records in: ${jsonFilePath}`);

} catch (err) {
    console.error('Error during conversion:', err);
    if (err.code === 'ENOENT') {
        console.log('Error: JSON file not found');
    }
}