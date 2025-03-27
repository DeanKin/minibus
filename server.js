// server.js
const express = require('express');
const app = express();
const port = 3000;

// Initialize 19 buttons
const buttonStates = Array.from({length: 19}, (_, i) => [i+1, 0])
  .reduce((acc, [id]) => ({...acc, [id]: 0}), {});

app.use(express.static('public'));

app.post('/button/:id', (req, res) => {
  const buttonId = parseInt(req.params.id);
  if (buttonStates[buttonId] !== undefined) {
    // Toggle state
    buttonStates[buttonId] = buttonStates[buttonId] ? 0 : 1;
    
    // Calculate total
    const total = Object.values(buttonStates).reduce((a, b) => a + b, 0);
    
    // Server log with timestamp
    const timestamp = new Date().toLocaleString();
    console.log(`[${timestamp}] Button ${buttonId} ${buttonStates[buttonId] ? 'ON' : 'OFF'} | Total: ${total}`);
    
    res.json({
      button: buttonId,
      state: buttonStates[buttonId],
      total: total
    });
  } else {
    res.status(400).json({ error: 'Invalid button ID' });
  }
});

app.listen(port, () => {
  console.log(`Server started at ${new Date().toLocaleString()}`);
});