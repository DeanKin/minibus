const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

// Ensure the output directory exists
const outputDir = path.join(__dirname, 'output');
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
}

// Paths to the JSON log files
const buttonLogsPath = path.join(outputDir, 'button_logs.json');
const latestRecordPath = path.join(outputDir, 'latest_record.json');

// Initialize the JSON files if they don't exist
if (!fs.existsSync(buttonLogsPath)) {
    fs.writeFileSync(buttonLogsPath, JSON.stringify([]));
}

if (!fs.existsSync(latestRecordPath)) {
    // Initialize latest_record.json with empty records for Car 1 to Car 6
    const initialRecords = {
        "Car 1": null,
        "Car 2": null,
        "Car 3": null,
        "Car 4": null,
        "Car 5": null,
        "Car 6": null,
    };
    fs.writeFileSync(latestRecordPath, JSON.stringify(initialRecords, null, 2));
}

let buttonStates = Array.from({ length: 19 }, (_, i) => [i + 1, 0])
    .reduce((acc, [id]) => ({ ...acc, [id]: 0 }), {});

app.use(express.json());
app.use(express.static('public'));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // Allow all origins
  next();
});

// Endpoint to get the latest_record.json
app.get('/output/latest_record.json', (req, res) => {
    try {
        const latestRecords = JSON.parse(fs.readFileSync(latestRecordPath, 'utf8'));
        res.json(latestRecords);
    } catch (error) {
        res.status(500).json({ error: 'Failed to read latest_record.json' });
    }
});

app.post('/button/:id', (req, res) => {
    const buttonId = parseInt(req.params.id);
    const car = req.body.car || 'Car 1'; // Default to Car 1 if no car is specified

    if (buttonStates[buttonId] !== undefined) {
        buttonStates[buttonId] = buttonStates[buttonId] ? 0 : 1;
        const total = Object.values(buttonStates).reduce((a, b) => a + b, 0);

        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
        const timestamp = `${now.getDate()}/${now.getMonth()+1}/${now.getFullYear()} T=${hours}:${minutes}:${seconds}`;
        const location = req.body.location || 'Unknown location';
        const location2 = req.body.location2 || 'Unknown location';

        // Create a log entry
        const logEntry = {
            car,
            timestamp,
            location,
            location2,
            buttonId,
            state: buttonStates[buttonId] ? 'ON' : 'OFF',
            total,
        };

        // Log to console
        console.log(logEntry);

        // Append log to button_logs.json
        const buttonLogs = JSON.parse(fs.readFileSync(buttonLogsPath, 'utf8'));
        buttonLogs.push(logEntry);
        fs.writeFileSync(buttonLogsPath, JSON.stringify(buttonLogs, null, 2));

        // Update the latest record for the specific car in latest_record.json
        const latestRecords = JSON.parse(fs.readFileSync(latestRecordPath, 'utf8'));
        latestRecords[car] = logEntry; // Update only the specified car's record
        fs.writeFileSync(latestRecordPath, JSON.stringify(latestRecords, null, 2));

        res.json({
            button: buttonId,
            state: buttonStates[buttonId],
            total: total,
        });
    } else {
        res.status(400).json({ error: 'Invalid button ID' });
    }
});

// Add new endpoint for clearing data
app.post('/clear', (req, res) => {
    const car = req.body.car || 'Car 1'; // Default to Car 1 if no car is specified
    buttonStates = Array.from({ length: 19 }, (_, i) => [i + 1, 0])
        .reduce((acc, [id]) => ({ ...acc, [id]: 0 }), {});

    const now = new Date();
    const timestamp = `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()} T=${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;

    // Create a log entry for clearing data
    const logEntry = {
        car,
        timestamp,
        location: 'Off',
        location2: 'Off',
        action: 'All data cleared',
        total: 0,
    };

    // Log to console
    console.log(logEntry);

    // Append log to button_logs.json
    const buttonLogs = JSON.parse(fs.readFileSync(buttonLogsPath, 'utf8'));
    buttonLogs.push(logEntry);
    fs.writeFileSync(buttonLogsPath, JSON.stringify(buttonLogs, null, 2));

    // Update the latest record for the specific car in latest_record.json
    const latestRecords = JSON.parse(fs.readFileSync(latestRecordPath, 'utf8'));
    latestRecords[car] = logEntry; // Update only the specified car's record
    fs.writeFileSync(latestRecordPath, JSON.stringify(latestRecords, null, 2));

    res.json({ success: true });
});

app.listen(port, () => {
    const now = new Date();
    const timestamp = `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()} T=${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
    console.log(`Server started at ${timestamp}`);
});