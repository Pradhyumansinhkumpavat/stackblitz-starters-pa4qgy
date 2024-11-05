export function generateUserID() {
  const userId = Math.random().toString(36).substring(2, 15);
  const userIdElement = document.getElementById('userID');
  if (userIdElement) {
    userIdElement.textContent = `Your User ID: ${userId}`;
  }
  localStorage.setItem('userId', userId);
}

export function login() {
  const loginInput = document.getElementById('loginUserID');
  if (!loginInput) return;
  
  const loginId = loginInput.value;
  if (!loginId) {
    alert('Please enter a User ID');
    return;
  }
  localStorage.setItem('currentUser', loginId);
  
  const loginSection = document.getElementById('login');
  const chatSection = document.getElementById('chat');
  if (loginSection) loginSection.style.display = 'none';
  if (chatSection) chatSection.style.display = 'block';
}

export function searchFriend() {
  const friendInput = document.getElementById('friendID');
  const searchResult = document.getElementById('searchResult');
  if (!friendInput || !searchResult) return;

  const friendId = friendInput.value;
  if (!friendId) {
    alert('Please enter a Friend\'s User ID');
    return;
  }
  searchResult.textContent = `Searching for user: ${friendId}`;
}

export function initAuth() {
  const generateBtn = document.getElementById('generateBtn');
  const loginBtn = document.getElementById('loginBtn');
  const searchBtn = document.getElementById('searchBtn');

  if (generateBtn) {
    generateBtn.addEventListener('click', generateUserID);
  }
  if (loginBtn) {
    loginBtn.addEventListener('click', login);
  }
  if (searchBtn) {
    searchBtn.addEventListener('click', searchFriend);
  }
}