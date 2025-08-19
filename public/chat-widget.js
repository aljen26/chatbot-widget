(function () {
  const container = document.getElementById("aichat-ui");

  // Floating button
  const toggleBtn = document.createElement("button");
  toggleBtn.textContent = "💬";
  toggleBtn.style.position = "fixed";
  toggleBtn.style.bottom = "20px";
  toggleBtn.style.right = "20px";
  toggleBtn.style.zIndex = "9999";
  toggleBtn.style.borderRadius = "50%";
  toggleBtn.style.width = "50px";
  toggleBtn.style.height = "50px";
  toggleBtn.style.cursor = "pointer";

  // Chatbox
  const chatWidget = document.createElement("div");
  chatWidget.style.display = "none";
  chatWidget.style.position = "fixed";
  chatWidget.style.bottom = "80px";
  chatWidget.style.right = "20px";
  chatWidget.style.width = "300px";
  chatWidget.style.height = "400px";
  chatWidget.style.border = "1px solid #ccc";
  chatWidget.style.borderRadius = "10px";
  chatWidget.style.background = "#fff";
  chatWidget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
  chatWidget.style.flexDirection = "column";
  chatWidget.style.overflow = "hidden";

  // Header
  const header = document.createElement("div");
  header.style.background = "#007bff";
  header.style.color = "white";
  header.style.padding = "10px";
  header.style.display = "flex";
  header.style.justifyContent = "space-between";
  header.innerHTML = `<span>AI Assistant</span>`;
  const closeBtn = document.createElement("button");
  closeBtn.textContent = "✖";
  closeBtn.style.background = "transparent";
  closeBtn.style.color = "white";
  closeBtn.style.border = "none";
  closeBtn.style.cursor = "pointer";
  header.appendChild(closeBtn);

  // Chat body
  const chatBody = document.createElement("div");
  chatBody.style.flex = "1";
  chatBody.style.padding = "10px";
  chatBody.style.overflowY = "auto";
  chatBody.style.display = "flex";
  chatBody.style.flexDirection = "column";
  chatBody.style.gap = "8px"; // spacing between bubbles
  chatBody.style.fontSize = "14px"; // standard readable size

  // Input area
  const inputArea = document.createElement("div");
  inputArea.style.display = "flex";
  inputArea.style.borderTop = "1px solid #ccc";

  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = "Type your message...";
  input.style.flex = "1";
  input.style.border = "none";
  input.style.padding = "10px";
  input.style.outline = "none";

  const sendBtn = document.createElement("button");
  sendBtn.textContent = "Send";
  sendBtn.style.border = "none";
  sendBtn.style.background = "#007bff";
  sendBtn.style.color = "white";
  sendBtn.style.padding = "10px";
  sendBtn.style.cursor = "pointer";

  inputArea.appendChild(input);
  inputArea.appendChild(sendBtn);

  chatWidget.appendChild(header);
  chatWidget.appendChild(chatBody);
  chatWidget.appendChild(inputArea);

  // Append to container
  container.appendChild(toggleBtn);
  container.appendChild(chatWidget);

  // Toggle widget
  toggleBtn.addEventListener("click", () => {
    chatWidget.style.display =
      chatWidget.style.display === "none" ? "flex" : "none";
  });
  closeBtn.addEventListener("click", () => {
    chatWidget.style.display = "none";
  });

  // Message helper
  function appendMessage(sender, text) {
    const msg = document.createElement("div");
    msg.style.padding = "10px 14px";
    msg.style.borderRadius = "16px";
    msg.style.maxWidth = "70%";
    msg.style.wordWrap = "break-word";
    msg.style.fontFamily = "Arial, sans-serif";

    if (sender === "user") {
      msg.style.alignSelf = "flex-end";
      msg.style.background = "#007bff";
      msg.style.color = "white";
      msg.style.borderBottomRightRadius = "4px"; // bubble look
    } else {
      msg.style.alignSelf = "flex-start";
      msg.style.background = "#f1f1f1";
      msg.style.color = "#333";
      msg.style.borderBottomLeftRadius = "4px";
    }

    msg.textContent = text;
    chatBody.appendChild(msg);
    chatBody.scrollTop = chatBody.scrollHeight;
  }
  // Send message
  async function sendMessage() {
    const message = input.value.trim();
    if (!message) return;
    appendMessage("user", message);
    input.value = "";

    const res = await fetch("/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    const data = await res.json();
    appendMessage("bot", data.reply);
  }

  sendBtn.addEventListener("click", sendMessage);
  input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
  });
})();
