// cryptoUtils.js

export async function encryptFile(file, password) {
  const iv = crypto.getRandomValues(new Uint8Array(16));

  const key = await getKeyFromPassword(password, iv);

  const fileBuffer = await file.arrayBuffer();

  const encryptedContent = await crypto.subtle.encrypt(
    { name: "AES-CBC", iv },
    key,
    fileBuffer
  );

  // Combine IV + encrypted content
  const combined = new Uint8Array(iv.byteLength + encryptedContent.byteLength);
  combined.set(iv, 0);
  combined.set(new Uint8Array(encryptedContent), iv.byteLength);

  return new Blob([combined], { type: file.type });
}

export async function decryptFile(encryptedBlob, password) {
  try {
    const encryptedArray = new Uint8Array(await encryptedBlob.arrayBuffer());

    const iv = encryptedArray.slice(0, 16);
    const data = encryptedArray.slice(16);

    const key = await getKeyFromPassword(password, iv);

    const decrypted = await crypto.subtle.decrypt(
      { name: "AES-CBC", iv },
      key,
      data
    );

    return new Blob([decrypted], { type: encryptedBlob.type });
  } catch (error) {
    console.error("Error during decryption:", error);
    throw new Error("Decryption failed!");
  }
}

async function getKeyFromPassword(password, salt) {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveKey"]
  );

  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt,
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-CBC", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}
