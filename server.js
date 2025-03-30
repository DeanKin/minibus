// server.js
const express = require('express');
const app = express();
const port = 3000;

let buttonStates = Array.from({length: 19}, (_, i) => [i+1, 0])
  .reduce((acc, [id]) => ({...acc, [id]: 0}), {});

app.use(express.json());
app.use(express.static('public'));

app.post('/button/:id', (req, res) => {
  const buttonId = parseInt(req.params.id);
  if (buttonStates[buttonId] !== undefined) {
    buttonStates[buttonId] = buttonStates[buttonId] ? 0 : 1;
    const total = Object.values(buttonStates).reduce((a, b) => a + b, 0);
    
    const now = new Date();
    const timestamp = `${now.getDate()}/${now.getMonth()+1}/${now.getFullYear()} T=${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
    
    const location = req.body.location || 'Unknown location';
    console.log(`[${timestamp}] Location: ${location} | Button ${buttonId} ${buttonStates[buttonId] ? 'ON' : 'OFF'} | Total: ${total}`);
    
    res.json({
      button: buttonId,
      state: buttonStates[buttonId],
      total: total
    });
  } else {
    res.status(400).json({ error: 'Invalid button ID' });
  }
});

// Add new endpoint for clearing data
app.post('/clear', (req, res) => {
  buttonStates = Array.from({length: 19}, (_, i) => [i+1, 0])
    .reduce((acc, [id]) => ({...acc, [id]: 0}), {});
  
  const now = new Date();
  const timestamp = `${now.getDate()}/${now.getMonth()+1}/${now.getFullYear()} T=${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
  console.log(`[${timestamp}] All data cleared`);
  
  res.json({ success: true });
});

app.listen(port, () => {
  const now = new Date();
  const timestamp = `${now.getDate()}/${now.getMonth()+1}/${now.getFullYear()} T=${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
  console.log(`Server started at ${timestamp}`);
});