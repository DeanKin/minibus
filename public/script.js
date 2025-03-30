// script.js
function updateClock() {
    const now = new Date();
    const timestamp = `${now.getDate()}/${now.getMonth()+1}/${now.getFullYear()} T=${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
    document.getElementById('liveClock').textContent = timestamp;
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
        console.warn('Please select a location first!');
        return;
    }

    fetch(`/button/${seatId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ location: selectedLocation })
    })
    .then(response => response.json())
    .then(data => {
        seat.classList.toggle('active', data.state === 1);
        
        const now = new Date();
        const timestamp = `${now.getDate()}/${now.getMonth()+1}/${now.getFullYear()} T=${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
        
        console.log(`[${timestamp}] Location: ${selectedLocation} | Seat ${data.button} ${data.state ? 'ON' : 'OFF'} | Total: ${data.total}`);
    })
    .catch(error => console.error('Error:', error));
}

window.onload = function() {
    updateClock();
    setInterval(updateClock, 1000);

    // Add clear button event listener
    document.getElementById('clearButton').addEventListener('click', clearAllData);
};