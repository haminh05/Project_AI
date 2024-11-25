const userInput = document.getElementById("user-input");
const chatMessages = document.getElementById("chat-messages");
const sendButton = document.getElementById("send-button");

// Function to add a message to the chat
function addMessage(content, sender, type = "text") {
  const messageElement = document.createElement("div");
  messageElement.classList.add("message", sender);

  if (type === "text") {
    messageElement.innerHTML = content.replace(/\n/g, "<br>");
  } else if (type === "image") {
    const img = document.createElement("img");
    img.src = content;
    img.alt = "Image";
    img.style.maxWidth = "100%";
    messageElement.appendChild(img);
  } else if (type === "video") {
    const iframe = document.createElement("iframe");
    iframe.src = content;
    iframe.width = "100%";
    iframe.height = "315px";
    iframe.frameBorder = "0";
    iframe.allow =
      "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
    iframe.allowFullscreen = true;
    messageElement.appendChild(iframe);
  } else if (type === "website") {
    const link = document.createElement("a");
    link.href = content;
    link.textContent = content;
    link.target = "_blank";
    messageElement.appendChild(link);
  }

  chatMessages.appendChild(messageElement);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Function to send a message to the chatbot
function sendMessage() {
  const message = userInput.value.trim();
  if (message === "") return;

  // Add user message to chat
  addMessage(message, "user");

  // Clear input field
  userInput.value = "";

  // Send message to Rasa server
  fetch("http://localhost:5005/webhooks/rest/webhook", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ sender: "user", message: message }),
  })
    .then((response) => response.json())
    .then((data) => {
      data.forEach((response) => {
        // Process different types of responses
        if (response.text) {
          addMessage(response.text, "bot", "text");
        }
        if (response.image) {
          addMessage(response.image, "bot", "image");
        }
        if (response.attachment) {
          const attachment = response.attachment;
          if (attachment.type === "video") {
            addMessage(attachment.payload.src, "bot", "video");
          } else if (attachment.type === "website") {
            addMessage(attachment.payload.src, "bot", "website");
          }
        }
      });
    })
    .catch((error) => {
      console.error("Error:", error);
      addMessage("Error connecting to the bot!", "bot", "text");
    });
}

// Event listener for send button
sendButton.addEventListener("click", sendMessage);

// Event listener for Enter key
userInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    sendMessage();
  }
});
