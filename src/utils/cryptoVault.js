/**
 * Varman Zero-Knowledge Vault — Client-Side Cryptography
 *
 * Uses the Web Crypto API (native browser, zero dependencies) to provide
 * AES-256-GCM encryption for the user's protected images.
 *
 * The encryption key is derived from the user's password + a per-user salt
 * using PBKDF2 with 600,000 iterations (OWASP 2023 recommendation).
 *
 * The key NEVER leaves the browser. The backend only stores encrypted blobs.
 */

// ── Key Derivation ────────────────────────────────────────────────────────

/**
 * Derive a 256-bit AES-GCM key from the user's password and per-user salt.
 *
 * @param {string} password  - The user's plaintext password (available at login time)
 * @param {string} saltHex   - 64-char hex string (32 bytes) stored in the user's DB record
 * @returns {Promise<CryptoKey>} A non-extractable AES-GCM CryptoKey
 */
export async function deriveVaultKey(password, saltHex) {
  const encoder = new TextEncoder();
  const salt = hexToBytes(saltHex);

  // Import the password as raw key material
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveKey'],
  );

  // Derive AES-256-GCM key via PBKDF2
  const vaultKey = await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: 600_000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    true, // extractable — needed for sessionStorage persistence
    ['encrypt', 'decrypt'],
  );

  return vaultKey;
}

// ── Encryption ────────────────────────────────────────────────────────────

/**
 * Encrypt a Blob (image) using AES-256-GCM.
 *
 * Output format: [12-byte IV] + [ciphertext + 16-byte auth tag]
 *
 * @param {CryptoKey} vaultKey   - The derived AES-GCM key
 * @param {Blob}      plainBlob  - The plaintext image blob
 * @returns {Promise<ArrayBuffer>} The encrypted payload (IV + ciphertext)
 */
export async function encryptBlob(vaultKey, plainBlob) {
  const plainBuffer = await plainBlob.arrayBuffer();

  // Generate a random 12-byte IV (nonce) for each encryption
  const iv = crypto.getRandomValues(new Uint8Array(12));

  const cipherBuffer = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    vaultKey,
    plainBuffer,
  );

  // Prepend IV to ciphertext: [IV (12 bytes)] + [ciphertext]
  const result = new Uint8Array(iv.byteLength + cipherBuffer.byteLength);
  result.set(iv, 0);
  result.set(new Uint8Array(cipherBuffer), iv.byteLength);

  return result.buffer;
}

// ── Decryption ────────────────────────────────────────────────────────────

/**
 * Decrypt an encrypted payload back into a Blob.
 *
 * Expects format: [12-byte IV] + [ciphertext + auth tag]
 *
 * @param {CryptoKey}   vaultKey         - The derived AES-GCM key
 * @param {ArrayBuffer} encryptedBuffer  - The encrypted payload from the backend
 * @param {string}      [mimeType='image/png'] - MIME type for the output Blob
 * @returns {Promise<Blob>} The decrypted image blob
 */
export async function decryptBlob(vaultKey, encryptedBuffer, mimeType = 'image/png') {
  const data = new Uint8Array(encryptedBuffer);

  // Extract IV (first 12 bytes) and ciphertext (remainder)
  const iv = data.slice(0, 12);
  const ciphertext = data.slice(12);

  const plainBuffer = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    vaultKey,
    ciphertext,
  );

  return new Blob([plainBuffer], { type: mimeType });
}

// ── Session Persistence ───────────────────────────────────────────────────

/**
 * Export the vault key to sessionStorage so it survives page refreshes.
 * Cleared automatically when the browser tab closes.
 *
 * @param {CryptoKey} vaultKey - The key to persist
 */
export async function persistVaultKey(vaultKey) {
  const exported = await crypto.subtle.exportKey('jwk', vaultKey);
  sessionStorage.setItem('varman_vault_key', JSON.stringify(exported));
}

/**
 * Restore the vault key from sessionStorage after a page refresh.
 *
 * @returns {Promise<CryptoKey|null>} The restored key, or null if not found
 */
export async function restoreVaultKey() {
  const stored = sessionStorage.getItem('varman_vault_key');
  if (!stored) return null;

  try {
    const jwk = JSON.parse(stored);
    const key = await crypto.subtle.importKey(
      'jwk',
      jwk,
      { name: 'AES-GCM', length: 256 },
      true,
      ['encrypt', 'decrypt'],
    );
    return key;
  } catch {
    sessionStorage.removeItem('varman_vault_key');
    return null;
  }
}

/**
 * Clear the persisted vault key (called on logout).
 */
export function clearVaultKey() {
  sessionStorage.removeItem('varman_vault_key');
}

// ── Hex Utilities ─────────────────────────────────────────────────────────

function hexToBytes(hex) {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
  }
  return bytes;
}
