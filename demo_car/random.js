const fs = require('fs');
const path = require('path');

// Path to the latest_record.json file
const latestRecordPath = path.join(__dirname, '..', 'output', 'latest_record.json');

// Array of possible locations
const locations = ["Hang Fa Chuen PTI", "1.Shing Tai Rd", "2.Wing Tai Rd", "3.Ka Yip St", "4.Sun Yip St", "5.Siu Sai Wan Rd", "Cheerful Garden","6.Sun Yip St", "7.Ka Yip St", "8.Sheung On St", "9.Chai Wan Rd", "10.Wing Tai St", "11.Tsui Wan St", "12.Shun Tai St", "13.Shing Tai Rd"];

// Locations that must have "往小西灣" as location2
const siuSaiWanDestinations = ["Hang Fa Chuen PTI", "1.Shing Tai Rd", "2.Wing Tai Rd", "3.Ka Yip St", "4.Sun Yip St","5.Siu Sai Wan Rd"];

// Function to generate a random record for a given car
function generateRandomRecord(car) {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const timestamp = `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()} T=${hours}:${minutes}:${seconds}`;

    // Randomly select a location from the locations array
    const randomLocation = locations[Math.floor(Math.random() * locations.length)];
    const location2 = siuSaiWanDestinations.includes(randomLocation) 
        ? "Siu Sai Wan" 
        : "Hang Fa Chuen PTI";

    return {
        car, // Use the provided car name
        timestamp,
        location: randomLocation, // Random location from the predefined list
        location2: location2,    // Determined by location rules
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