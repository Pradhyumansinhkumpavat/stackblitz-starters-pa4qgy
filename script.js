// Media feed management
let currentFilter = 'all';
const mediaStore = new Map();

function addToMediaFeed(mediaData) {
  mediaStore.set(mediaData.id, mediaData);
  renderMediaFeed();
}

function createMediaCard(mediaData) {
  const card = document.createElement('div');
  card.className = 'media-card';
  
  const content = mediaData.type.startsWith('image/') ?
    document.createElement('img') :
    document.createElement('video');
    
  content.className = 'media-content';
  content.src = mediaData.url;
  if (content.tagName === 'VIDEO') {
    content.controls = true;
  }
  
  const info = document.createElement('div');
  info.className = 'media-info';
  info.innerHTML = `
    <div class="media-user">${mediaData.username}</div>
    <div class="media-timestamp">${new Date(mediaData.timestamp).toLocaleString()}</div>
  `;
  
  card.appendChild(content);
  card.appendChild(info);
  return card;
}

function renderMediaFeed() {
  const feed = document.getElementById('mediaFeed');
  if (!feed) return;
  
  feed.innerHTML = '';
  const username = localStorage.getItem('username');
  
  for (const mediaData of mediaStore.values()) {
    if (currentFilter === 'my' && mediaData.username !== username) continue;
    if (currentFilter === 'friends' && !mediaData.isFriend) continue;
    if (mediaData.isPrivate) continue;
    
    feed.appendChild(createMediaCard(mediaData));
  }
}

// Initialize feed and filters
document.addEventListener('DOMContentLoaded', () => {
  const filterButtons = document.querySelectorAll('.feed-filters .btn');
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      currentFilter = button.dataset.filter;
      renderMediaFeed();
    });
  });
  
  // Example media items (in a real app, these would come from a backend)
  const sampleMedia = [
    {
      id: '1',
      url: 'https://picsum.photos/300/200',
      type: 'image/jpeg',
      username: 'user1',
      timestamp: Date.now() - 3600000,
      isPrivate: false,
      isFriend: true
    },
    {
      id: '2',
      url: 'https://picsum.photos/301/200',
      type: 'image/jpeg',
      username: localStorage.getItem('username') || 'you',
      timestamp: Date.now() - 7200000,
      isPrivate: false,
      isFriend: false
    }
  ];
  
  sampleMedia.forEach(media => addToMediaFeed(media));
});

// Chat functionality (only runs on chat page)
if (window.location.pathname === '/chat.html') {
  const messages = document.getElementById('messages');
  const messageInput = document.getElementById('messageInput');
  const sendButton = document.getElementById('sendMessage');
  const usernameInput = document.getElementById('username');
  const setNameButton = document.getElementById('setName');

  let username = localStorage.getItem('username') || '';
  usernameInput.value = username;

  setNameButton?.addEventListener('click', () => {
    username = usernameInput.value.trim();
    localStorage.setItem('username', username);
    alert('Name set successfully!');
  });

  function addMessage(text) {
    if (!username) {
      alert('Please set your name first!');
      return;
    }
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message';
    messageDiv.innerHTML = `<span class="username">${username}:</span> ${text}`;
    messages?.appendChild(messageDiv);
    if (messages) messages.scrollTop = messages.scrollHeight;
  }

  sendButton?.addEventListener('click', () => {
    const message = messageInput?.value.trim();
    if (message) {
      addMessage(message);
      if (messageInput) messageInput.value = '';
    }
  });

  messageInput?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      const message = messageInput.value.trim();
      if (message) {
        addMessage(message);
        messageInput.value = '';
      }
    }
  });
}

console.log('Script loaded successfully!');