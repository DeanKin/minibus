// public/script.js
let passengerCount = 0;
let currentLocation = 'Not selected';
let isStartPoint = true; // Track START/END state

// Add these new functions
function toggleStartEndPoint() {
    isStartPoint = !isStartPoint;
    const button = document.getElementById('startEndButton');
    button.textContent = isStartPoint ? 'Start Point' : 'End Point';
    logAction(`Point changed to: ${isStartPoint ? 'START' : 'END'}`);
}




function updateClock() {
    const now = new Date();
    const timestamp = `${now.getDate()}/${now.getMonth()+1}/${now.getFullYear()} T=${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
    document.getElementById('liveClock').textContent = timestamp;
}

function updateStatusPanel() {
    document.getElementById('passengerCount').textContent = passengerCount;
    document.getElementById('currentLocation').textContent = currentLocation;
}

function clearAllData() {
    fetch('/clear', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.json())
    .then(data => {
        // Reset all seats
        document.querySelectorAll('.seat').forEach(seat => {
            seat.classList.remove('active');
        });
        
        // Reset location selector
        document.getElementById('locationSelect').value = '';
        currentLocation = 'Not selected';
        passengerCount = 0;
        updateStatusPanel();
        
        const now = new Date();
        const timestamp = `${now.getDate()}/${now.getMonth()+1}/${now.getFullYear()} T=${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
        console.log(`[${timestamp}] All data cleared and reset`);
    })
    .catch(error => console.error('Error:', error));
}

function toggleSeat(seatId) {
    const seat = event.target;
    const locationSelect = document.getElementById('locationSelect');
    const selectedLocation = locationSelect.value;
    
    if (!selectedLocation) {
        logAction('Please select a location first!');
        return;
    }

    fetch(`/button/${seatId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            location: selectedLocation,
            pointType: isStartPoint ? 'start' : 'end' // Add point type
        })
    })
    .then(response => response.json())
    .then(data => {
        const wasActive = seat.classList.contains('active');
        seat.classList.toggle('active', data.state === 1);
        
        // Update passenger count
        passengerCount += data.state === 1 ? 1 : -1;
        currentLocation = `${selectedLocation} (${isStartPoint ? 'START' : 'END'})`;
        updateStatusPanel();
        
        logAction(
            `Location: ${selectedLocation} | ` +
            `Seat ${data.button} ${data.state ? 'ON' : 'OFF'} | ` +
            `Type: ${isStartPoint ? 'START' : 'END'} | ` +
            `Total: ${data.total}`
        );
    })
    .catch(error => console.error('Error:', error));
}
function clearAllData() {
    fetch('/clear', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.json())
    .then(data => {
        // Reset all seats
        document.querySelectorAll('.seat').forEach(seat => {
            seat.classList.remove('active');
        });
        
        // Reset controls
        document.getElementById('locationSelect').value = '';
        document.getElementById('startEndButton').textContent = 'START Point';
        currentLocation = 'Not selected';
        passengerCount = 0;
        isStartPoint = true; // Reset to default
        
        updateStatusPanel();
        logAction('All data cleared and reset');
    })
    .catch(error => console.error('Error:', error));
}

window.onload = function() {
    updateClock();
    setInterval(updateClock, 1000);
    updateStatusPanel();

    // Event listeners
    document.getElementById('clearButton').addEventListener('click', clearAllData);
    document.getElementById('startEndButton').addEventListener('click', toggleStartEndPoint);
    document.getElementById('locationSelect').addEventListener('change', function() {
        currentLocation = this.value || 'Not selected';
        updateStatusPanel();
    });
};