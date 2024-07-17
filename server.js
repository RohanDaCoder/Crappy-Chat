const WebSocket = require('ws');
const PORT = 26096;

const wss = new WebSocket.Server({
  port: PORT
});

let messages = [];

wss.on('connection', (ws) => {
  ws.on('message', (data) => {
    const {
      sender,
      message
    } = JSON.parse(data);

    if (!sender || sender === null || sender === '') return;

    messages.push({
      sender,
      message
    });

    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({
          sender,
          message,
          history: messages
        }));
      }
    });

    console.log(`${sender}: ${message}`);
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });

  ws.send(JSON.stringify({
    history: messages
  }));
});

wss.on('close', () => {
  console.log('WebSocket server closed, clearing chat history');
  messages = [];
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({
        history: []
      }));
    }
  });
});

console.log(`WebSocket server running on ws://localhost:${PORT}`)