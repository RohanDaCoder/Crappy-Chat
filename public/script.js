$(document).ready(function() {
  const wsUrl = "ws://pnode3.danbot.host:8374";
  const username = localStorage.getItem("username");

  if (!username) {
    window.location.href = "login.html";
    return;
  }

  let ws;

  function connectWebSocket() {
    ws = new WebSocket(wsUrl);

    ws.onopen = function() {
      console.log("Connected to the WebSocket server");
    };

    ws.onmessage = function(event) {
      const data = JSON.parse(event.data);
      if (data.history) {
        data.history.forEach(addMessage);
      } else if (data.sender && data.message) {
        addMessage({ sender: data.sender, message: data.message });
      }
    };

    ws.onerror = function(error) {
      console.error("WebSocket error:", error);
      showError("WebSocket error occurred. Please try again later.");
    };

    ws.onclose = function(event) {
      console.log("Disconnected from the WebSocket server");
      if (event.code === 1006) {
        showError("The Server is offline. Please try again later.");
      }
    };
  }

  function addMessage(message) {
    const messageList = document.getElementById("messageList");
    const listItem = document.createElement("li");
    listItem.innerHTML = `<strong>${message.sender}:</strong> ${message.message}`;
    messageList.appendChild(listItem);

    const maxMessages = 10;
    const messages = messageList.querySelectorAll("li");
    if (messages.length > maxMessages) {
      messageList.removeChild(messages[0]);
    }

    messageList.scrollTop = messageList.scrollHeight;
  }

  function showError(message) {
    const errorTitle = "An Error Occurred";
    const errorMessage = message;
    window.location.href = `error.html?title=${encodeURIComponent(errorTitle)}&message=${encodeURIComponent(errorMessage)}`;
  }

  connectWebSocket();

  $("#messageForm").submit(function(event) {
    event.preventDefault();
    const message = $("#message").val();

    if (message.trim() !== "") {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ sender: username, message }));
        $("#message").val("").focus();
      } else {
        showError("Connection could not be made. Please wait or refresh the page.");
      }
    }
  });

  $("#signOutButton").click(function() {
    localStorage.removeItem("username");
    if (ws) {
      ws.close();
    }
    window.location.href = "signout.html";
  });
});