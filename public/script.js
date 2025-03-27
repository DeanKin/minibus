// public/script.js
window.onload = function() {
    const container = document.getElementById('buttonGrid');
    
    // Create 19 buttons
    for (let i = 1; i <= 19; i++) {
        const button = document.createElement('button');
        button.textContent = `Btn ${i}`;
        button.onclick = () => toggleButton(i);
        container.appendChild(button);
    }
};

function toggleButton(buttonId) {
    const button = event.target;
    fetch(`/button/${buttonId}`, { method: 'POST' })
        .then(response => response.json())
        .then(data => {
            button.classList.toggle('active', data.state === 1);
            const clientTime = new Date().toLocaleString();
            console.log(`[${clientTime}] Btn ${data.button} ${data.state ? 'ON' : 'OFF'} | Total: ${data.total}`);
        })
        .catch(error => console.error('Error:', error));
}