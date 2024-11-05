// Security utilities for media encryption
const encoder = new TextEncoder();
const decoder = new TextDecoder();

async function generateKey(password) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveBits', 'deriveKey']
  );
  
  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );
}

export async function encryptFile(arrayBuffer) {
  const key = await generateKey(localStorage.getItem('userId') || 'default-key');
  const iv = crypto.getRandomValues(new Uint8Array(12));
  
  const encryptedContent = await crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv
    },
    key,
    arrayBuffer
  );

  const encryptedArray = new Uint8Array(iv.length + encryptedContent.byteLength);
  encryptedArray.set(iv);
  encryptedArray.set(new Uint8Array(encryptedContent), iv.length);
  
  return encryptedArray;
}

export async function decryptFile(encryptedData) {
  const iv = encryptedData.slice(0, 12);
  const content = encryptedData.slice(12);
  
  const key = await generateKey(localStorage.getItem('userId') || 'default-key');
  
  return crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv
    },
    key,
    content
  );
}