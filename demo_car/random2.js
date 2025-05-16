const fs = require('fs');
const path = require('path');

// Path to the latest_record.json file
const latestRecordPath = path.join(__dirname, '..', 'output', 'latest_record.json');

// Array of possible locations
const locations = ["杏花邨公共運輸交匯處","1.盛泰道", "2.永泰道", "3.嘉業街", "4.新業街", "5.小西灣道", "6.新業街", "7.嘉業街", "8.常安街", "9.柴灣道", "10.永泰道", "11.翠灣街", "12.順泰道", "13.盛泰道"];
const locations2 = ["往杏花邨", "往小西灣"];
// Function to generate a random record for a given car
function generateRandomRecord(car) {
    const now = new Date();
    const timestamp = `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()} T=${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;

    // Randomly select a location from the locations array
    const randomLocation = locations[Math.floor(Math.random() * locations.length)];
    const randomLocation2 = locations2[Math.floor(Math.random() * locations2.length)];

    return {
        car, // Use the provided car name
        timestamp,
        location: randomLocation, // Random location from the predefined list
        location2: randomLocation2, // Random location from the predefined list
        buttonId: Math.floor(Math.random() * 19) + 1, // Random button ID between 1 and 19
        state: Math.random() > 0.5 ? "ON" : "OFF", // Random state (ON or OFF)
        total: Math.floor(Math.random() * 20), // Random total between 0 and 19
    };
}

// Function to update latest_record.json with a new random record for Car 2 to Car 6
function updateLatestRecord() {
    // Read the existing latest_record.json file
    let latestRecords = {};
    if (fs.existsSync(latestRecordPath)) {
        latestRecords = JSON.parse(fs.readFileSync(latestRecordPath, 'utf8'));
    } else {
        // Initialize with empty records for Car 1 to Car 6 if the file doesn't exist
        latestRecords = {
            "Car 1": null,
            "Car 2": null,
            "Car 3": null,
            "Car 4": null,
            "Car 5": null,
            "Car 6": null,
        };
    }

    // Randomly select a car from Car 2 to Car 6
    const randomCarIndex = Math.floor(Math.random() * 5) + 2; // Random index between 2 and 6
    const randomCar = `Car ${randomCarIndex}`;

    // Generate a new random record for the selected car
    const newRecord = generateRandomRecord(randomCar);

    // Update the selected car's record in latest_record.json
    latestRecords[randomCar] = newRecord;

    // Write the updated records back to the file
    fs.writeFileSync(latestRecordPath, JSON.stringify(latestRecords, null, 2));

    console.log(`Updated latest_record.json with a new record for ${randomCar}:`);
    console.log(newRecord);
}

// Run the update function every 10 seconds
setInterval(updateLatestRecord, 10000); // 10000 milliseconds = 10 seconds

console.log("random.js is running and will update records every 10 seconds...");