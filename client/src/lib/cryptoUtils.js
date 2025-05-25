// cryptoUtils.js

function hexToBytes(hex) {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
  }
  return bytes;
}

export async function encryptFile(file, hashedPasswordHex) {
  const iv = crypto.getRandomValues(new Uint8Array(16)); // Random IV

  // Use SHA-256 hash as AES key
  const key = await crypto.subtle.importKey(
    "raw",
    hexToBytes(hashedPasswordHex),
    { name: "AES-CBC" },
    false,
    ["encrypt"]
  );

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

export async function decryptFile(encryptedBlob, hashedPasswordHex) {
  try {
    const encryptedArray = new Uint8Array(await encryptedBlob.arrayBuffer());

    const iv = encryptedArray.slice(0, 16); // First 16 bytes = IV
    const data = encryptedArray.slice(16);  // Rest = Encrypted content

    // Use SHA-256 hash as AES key
    const key = await crypto.subtle.importKey(
      "raw",
      hexToBytes(hashedPasswordHex),
      { name: "AES-CBC" },
      false,
      ["decrypt"]
    );

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
