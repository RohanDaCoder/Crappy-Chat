const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const colors = require("colors");
const path = require("path");

const PORT = 26096;

// Create an Express application
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let messages = [];

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

wss.on("connection", (client) => {
  let username = "";

  client.on("message", (data) => {
    const { sender, message } = JSON.parse(data);

    if (!sender || sender.trim() === "") return;

    if (!username) {
      username = sender;
      console.log(colors.green(`[Gateway] ${username} joined the chat`));
    }

    const newMessage = { sender, message };
    messages.push(newMessage);

    wss.clients.forEach((recipient) => {
      if (recipient.readyState === WebSocket.OPEN) {
        recipient.send(
          JSON.stringify({
            sender,
            message,
            history: messages,
          })
        );
      }
    });

    console.log(colors.yellow(`${sender}: ${message}`));
  });

  client.on("close", () => {
    if (username) {
      console.log(colors.red(`[Gateway] ${username} left the chat`));
    } else {
      console.log(colors.red("[Gateway] Client disconnected"));
    }
  });

  client.send(
    JSON.stringify({
      history: messages,
    })
  );
});

wss.on("close", () => {
  console.log(
    colors.red("[Error] WebSocket server closed, clearing chat history")
  );
  messages = [];
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(
        JSON.stringify({
          history: [],
        })
      );
    }
  });
});

server.listen(PORT, () => {
  console.log(
    colors.cyan(
      `[Gateway] WebSocket server running on http://localhost:${PORT}`
    )
  );
});
