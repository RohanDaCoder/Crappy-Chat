$(document).ready(function() {
  const ws = new WebSocket('ws://localhost:26096');
  const username = localStorage.getItem('username');

  if (!username) {
    window.location.href = 'login.html';
    return;
  }

  function addMessage(message) {
    const listItem = document.createElement('li');
    listItem.innerHTML = `
      <strong>${message.sender}:</strong> ${message.message}
    `;
    document.getElementById('messageList').appendChild(listItem);
  }

  ws.onopen = function() {
    console.log('Connected to the WebSocket server');
  };

  ws.onmessage = function(event) {
    const data = JSON.parse(event.data);
    if (data.history) {
      $('#messageList').empty();
      data.history.forEach(addMessage);
    } else if (data.sender && data.message) {
      addMessage({
        sender: data.sender,
        message: data.message
      });
    }
  };

  ws.onerror = function(error) {
    console.error('WebSocket error:', error);
  };

  ws.onclose = function() {
    console.log('Disconnected from the WebSocket server');
  };

  $('#messageForm').submit(function(event) {
    event.preventDefault();
    const message = $('#message').val();

    if (message.trim() !== '') {
      ws.send(JSON.stringify({ sender: username, message }));
      $('#message').val('').focus();
    }
  });

  $('#signOutButton').click(function() {
    localStorage.removeItem('username');
    ws.close();
    window.location.href = 'signout.html';
  });
});