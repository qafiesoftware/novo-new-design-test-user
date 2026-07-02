const KEY = process.env.NEXT_PUBLIC_ENCRYPTION_KEY as string;

// Base64 string → CryptoKey object
async function getKey(): Promise<CryptoKey> {
  const rawKey = Uint8Array.from(atob(KEY), (c) => c.charCodeAt(0));
  return crypto.subtle.importKey(
    'raw',
    rawKey,
    { name: 'AES-CBC' },
    false,
    ['encrypt', 'decrypt']
  );
}

// Encrypt
export async function encryptPayload(data: unknown): Promise<string> {
  const key = await getKey();
  const iv = crypto.getRandomValues(new Uint8Array(16)); // random IV

  const encoded = new TextEncoder().encode(JSON.stringify(data));

  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-CBC', iv },
    key,
    encoded
  );

  const cipherText = btoa(String.fromCharCode(...new Uint8Array(encrypted)));
  const ivBase64 = btoa(String.fromCharCode(...iv));

  return btoa(`${cipherText}::${ivBase64}`);
}

// Decrypt
export async function decryptResponse(encryptedText: string): Promise<string> {
  const key = await getKey();

  const decoded = atob(encryptedText);
  const [cipherText, ivBase64] = decoded.split('::');

  const cipherBuffer = Uint8Array.from(atob(cipherText), (c) => c.charCodeAt(0));
  const iv = Uint8Array.from(atob(ivBase64), (c) => c.charCodeAt(0));

  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-CBC', iv },
    key,
    cipherBuffer
  );

  return new TextDecoder().decode(decrypted);
}