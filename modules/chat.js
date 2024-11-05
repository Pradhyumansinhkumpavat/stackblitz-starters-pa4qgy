export function sendMessage() {
  const input = document.getElementById('chatInput');
  const chatWindow = document.getElementById('chatWindow');
  if (!input || !chatWindow) return;

  const message = input.value;
  if (!message) return;

  const messageElement = document.createElement('p');
  messageElement.textContent = `You: ${message}`;
  chatWindow.appendChild(messageElement);
  input.value = '';
}

export function initChat() {
  const sendBtn = document.getElementById('sendBtn');
  if (sendBtn) {
    sendBtn.addEventListener('click', sendMessage);
  }
}