/**
 * Varman Vault IndexedDB — Local Image Cache
 *
 * Provides a performance cache layer for decrypted images in the browser's
 * IndexedDB. This avoids re-downloading and re-decrypting images on every
 * gallery visit.
 *
 * Data stored here is the DECRYPTED image blob + metadata. It is scoped to
 * the browser and cleared on logout via clearVaultCache().
 */

const DB_NAME = 'varman_vault';
const DB_VERSION = 1;
const STORE_NAME = 'images';

// ── Database Connection ───────────────────────────────────────────────────

/**
 * Open (or create) the Varman vault IndexedDB database.
 *
 * @returns {Promise<IDBDatabase>}
 */
function openVaultDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// ── Cache Operations ──────────────────────────────────────────────────────

/**
 * Cache a decrypted image blob in IndexedDB.
 *
 * @param {string} imageId   - The image UUID
 * @param {Blob}   blob      - The decrypted image blob
 * @param {Object} [metadata={}] - Optional metadata (filename, ssim, etc.)
 */
export async function cacheImage(imageId, blob, metadata = {}) {
  try {
    const db = await openVaultDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);

    store.put({
      id: imageId,
      blob,
      metadata,
      cachedAt: Date.now(),
    });

    return new Promise((resolve, reject) => {
      tx.oncomplete = () => { db.close(); resolve(); };
      tx.onerror = () => { db.close(); reject(tx.error); };
    });
  } catch (err) {
    console.warn('[VaultDB] Failed to cache image:', err);
  }
}

/**
 * Retrieve a cached image from IndexedDB.
 *
 * @param {string} imageId - The image UUID
 * @returns {Promise<{blob: Blob, metadata: Object}|null>}
 */
export async function getCachedImage(imageId) {
  try {
    const db = await openVaultDB();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const request = store.get(imageId);

    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        db.close();
        const result = request.result;
        if (result) {
          resolve({ blob: result.blob, metadata: result.metadata });
        } else {
          resolve(null);
        }
      };
      request.onerror = () => { db.close(); reject(request.error); };
    });
  } catch (err) {
    console.warn('[VaultDB] Failed to get cached image:', err);
    return null;
  }
}

/**
 * Delete a single cached image from IndexedDB.
 *
 * @param {string} imageId - The image UUID
 */
export async function deleteCachedImage(imageId) {
  try {
    const db = await openVaultDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.delete(imageId);

    return new Promise((resolve, reject) => {
      tx.oncomplete = () => { db.close(); resolve(); };
      tx.onerror = () => { db.close(); reject(tx.error); };
    });
  } catch (err) {
    console.warn('[VaultDB] Failed to delete cached image:', err);
  }
}

/**
 * Wipe all cached images from IndexedDB (called on logout).
 */
export async function clearVaultCache() {
  try {
    const db = await openVaultDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.clear();

    return new Promise((resolve, reject) => {
      tx.oncomplete = () => { db.close(); resolve(); };
      tx.onerror = () => { db.close(); reject(tx.error); };
    });
  } catch (err) {
    console.warn('[VaultDB] Failed to clear cache:', err);
  }
}
