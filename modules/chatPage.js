import { MediaHandler } from './mediaHandler.js';

let userName = '';
let isPrivateUpload = false;

function joinChat(e) {
    e.preventDefault();
    const nameInput = document.getElementById('userName');
    if (!nameInput || !nameInput.value.trim()) {
        alert('Please enter your name');
        return;
    }

    userName = nameInput.value.trim();
    
    // Update UI
    const userSetup = document.getElementById('userSetup');
    const chatRoom = document.getElementById('chatRoom');
    const userDisplayName = document.getElementById('userDisplayName');
    
    if (userSetup && chatRoom && userDisplayName) {
        userSetup.style.display = 'none';
        chatRoom.style.display = 'block';
        userDisplayName.textContent = userName;
        localStorage.setItem('chatUserName', userName);
    }
}

async function handleMediaUpload(file, isPrivate) {
    try {
        const mediaData = await MediaHandler.handleFileUpload(file, isPrivate);
        if (!mediaData) return;

        const mediaElement = MediaHandler.createMediaElement(mediaData);
        if (isPrivate) {
            mediaElement.querySelector('.media-content').classList.add('private-media');
        }

        const messageElement = document.createElement('div');
        messageElement.className = 'message';
        messageElement.innerHTML = `
            <span class="message-user">${userName}</span>
            <span class="message-time">${new Date().toLocaleTimeString()}</span>
            ${isPrivate ? '<span class="private-badge">Private</span>' : ''}
        `;
        messageElement.appendChild(mediaElement);

        const chatWindow = document.getElementById('chatWindow');
        if (chatWindow) {
            chatWindow.appendChild(messageElement);
            chatWindow.scrollTop = chatWindow.scrollHeight;
        }
    } catch (error) {
        alert(`Upload failed: ${error.message}`);
    }
}

function sendMessage() {
    const input = document.getElementById('chatInput');
    const chatWindow = document.getElementById('chatWindow');
    if (!input || !chatWindow) return;

    const message = input.value.trim();
    if (!message) return;

    const messageElement = document.createElement('div');
    messageElement.className = 'message';
    
    const timestamp = new Date().toLocaleTimeString();
    messageElement.innerHTML = `
        <span class="message-user">${userName}</span>
        <span class="message-time">${timestamp}</span>
        <div class="message-content">${message}</div>
    `;
    
    chatWindow.appendChild(messageElement);
    chatWindow.scrollTop = chatWindow.scrollHeight;
    input.value = '';
}

function handleEnterKey(e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
}

// Initialize chat page
document.addEventListener('DOMContentLoaded', () => {
    const joinBtn = document.getElementById('joinChat');
    const sendBtn = document.getElementById('sendBtn');
    const chatInput = document.getElementById('chatInput');
    const uploadBtn = document.getElementById('uploadBtn');
    const privateUploadBtn = document.getElementById('privateUploadBtn');
    const mediaUpload = document.getElementById('mediaUpload');
    
    // Check if user already has a name
    const savedName = localStorage.getItem('chatUserName');
    if (savedName) {
        userName = savedName;
        const userSetup = document.getElementById('userSetup');
        const chatRoom = document.getElementById('chatRoom');
        const userDisplayName = document.getElementById('userDisplayName');
        
        if (userSetup && chatRoom && userDisplayName) {
            userSetup.style.display = 'none';
            chatRoom.style.display = 'block';
            userDisplayName.textContent = userName;
        }
    }

    if (joinBtn) {
        joinBtn.addEventListener('click', joinChat);
    }
    
    if (sendBtn) {
        sendBtn.addEventListener('click', sendMessage);
    }

    if (chatInput) {
        chatInput.addEventListener('keypress', handleEnterKey);
    }

    if (uploadBtn) {
        uploadBtn.addEventListener('click', () => {
            isPrivateUpload = false;
            mediaUpload?.click();
        });
    }

    if (privateUploadBtn) {
        privateUploadBtn.addEventListener('click', () => {
            isPrivateUpload = true;
            mediaUpload?.click();
        });
    }

    if (mediaUpload) {
        mediaUpload.addEventListener('change', (e) => {
            const file = e.target.files?.[0];
            if (file) {
                handleMediaUpload(file, isPrivateUpload);
            }
            // Reset input to allow uploading the same file again
            e.target.value = '';
        });
    }
});