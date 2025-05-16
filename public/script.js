// public/script.js
let passengerCount = 0;
let currentLocation = 'Not selected';
let currentLocation2 = 'Not selected';

function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const timestamp = `${now.getDate()}/${now.getMonth()+1}/${now.getFullYear()} T=${hours}:${minutes}:${seconds}`;
    document.getElementById('liveClock').textContent = timestamp;
}

function updateStatusPanel() {
    document.getElementById('passengerCount').textContent = passengerCount;
    document.getElementById('currentLocation').textContent = currentLocation;
     document.getElementById('currentLocation2').textContent = currentLocation2;
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
        document.getElementById('locationSelect2').value = '';
        currentLocation2 = 'Not selected';
        passengerCount = 0;
        updateStatusPanel();
        
        

        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
        const timestamp = `${now.getDate()}/${now.getMonth()+1}/${now.getFullYear()} T=${hours}:${minutes}:${seconds}`;
        console.log(`[${timestamp}] All data cleared and reset`);
    })
    .catch(error => console.error('Error:', error));
}

function toggleSeat(seatId) {
    const seat = event.target;
    const locationSelect = document.getElementById('locationSelect');
    const selectedLocation = locationSelect.value;
    const locationSelect2 = document.getElementById('locationSelect2');
    const selectedLocation2 = locationSelect2.value;
    
    if (!selectedLocation) {
        console.warn('Please select a location first!');
        return;
    }

    fetch(`/button/${seatId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ location: selectedLocation ,location2: selectedLocation2 })
        
    })
    .then(response => response.json())
    .then(data => {
        const wasActive = seat.classList.contains('active');
        seat.classList.toggle('active', data.state === 1);
        
        // Update passenger count
        passengerCount += data.state === 1 ? 1 : -1;
        currentLocation = selectedLocation;
        currentLocation2 = selectedLocation2;
        updateStatusPanel();
        
        const now = new Date();
const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
        const timestamp = `${now.getDate()}/${now.getMonth()+1}/${now.getFullYear()} T=${hours}:${minutes}:${seconds}`;
        
        console.log(`[${timestamp}] Location: ${selectedLocation} |Location2: ${selectedLocation2} | Seat ${data.button} ${data.state ? 'ON' : 'OFF'} | Total: ${data.total}`);
    })
    .catch(error => console.error('Error:', error));
}

window.onload = function() {
    updateClock();
    setInterval(updateClock, 1000);
    updateStatusPanel();

    // Add clear button event listener
    document.getElementById('clearButton').addEventListener('click', clearAllData);

    // Add location change listener
    document.getElementById('locationSelect').addEventListener('change', function() {
        currentLocation = this.value || 'Not selected';
        updateStatusPanel();
    });
};