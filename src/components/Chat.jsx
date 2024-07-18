import React, { useState, useEffect } from 'react';

function Chat() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const username = localStorage.getItem('username');

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:3000');

    ws.onopen = () => {
      console.log('Connected to the WebSocket server');
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.history) {
        setMessages(data.history);
      } else if (data.sender && data.message) {
        setMessages((prevMessages) => [...prevMessages, { sender: data.sender, message: data.message }]);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      showError('WebSocket error occurred. Please try again later.');
    };

    ws.onclose = (event) => {
      console.log('Disconnected from the WebSocket server');
      if (event.code === 1006) {
        showError('The Server is offline. Please try again later.');
      }
    };

    return () => {
      ws.close();
    };
  }, []);

  const handleSendMessage = (event) => {
    event.preventDefault();

    if (message.trim() !== '') {
      const ws = new WebSocket('ws://localhost:3000');
      ws.onopen = () => {
        ws.send(JSON.stringify({ sender: username, message }));
      };
      setMessage('');
    }
  };

  return (
    <div className="container mx-auto h-screen flex flex-col">
      <header className="bg-gray-800 text-white py-4 px-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Crappy Chat</h1>
        <button
          onClick={() => {
            localStorage.removeItem('username');
            window.location.href = '/';
          }}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Sign Out
        </button>
      </header>
      <main className="flex-1 flex items-center justify-center">
        <div className="max-w-lg w-full p-6 bg-white shadow-lg rounded-lg">
          <ul className="space-y-2 max-h-80 overflow-y-auto">
            {messages.map((msg, index) => (
              <li key={index}>
                <strong>{msg.sender}:</strong> {msg.message}
              </li>
            ))}
          </ul>
          <form onSubmit={handleSendMessage} className="flex items-center space-x-4 mt-4">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1 py-2 px-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="Type your message..."
              required
            />
            <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg">
              Send
            </button>
          </form>
        </div>
      </main>
      <footer className="bg-gray-800 text-white py-4 text-center">
        &copy; 2024 Crappy Chat. All rights reserved.
      </footer>
    </div>
  );
}

export default Chat;