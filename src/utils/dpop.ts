import { getDB, DPOP_KEYS_STORE } from './imageStorage';

export async function generateKeyPair(): Promise<CryptoKeyPair> {
  return await crypto.subtle.generateKey(
    {
      name: 'ECDSA',
      namedCurve: 'P-256',
    },
    true,
    ['sign', 'verify']
  );
}

export async function exportPublicKey(publicKey: CryptoKey): Promise<JsonWebKey> {
  return await crypto.subtle.exportKey('jwk', publicKey);
}

async function hashAccessToken(token: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(token);

  const hashBuffer = await crypto.subtle.digest('SHA-256', data);

  const base64Url = btoa(
    String.fromCharCode(...new Uint8Array(hashBuffer))
  )
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  return base64Url;
}

export async function createDpopProof(
  privateKey: CryptoKey,
  url: string,
  method: string,
  accessToken: string
): Promise<string> {
  const encoder = new TextEncoder();

  const header = {
    alg: 'ES256',
    typ: 'dpop+jwt',
  };

  const ath = await hashAccessToken(accessToken);

  const payload = {
    htu: url,
    htm: method,
    iat: Math.floor(Date.now() / 1000),
    jti: crypto.randomUUID(),
    ath
  };

  const base64Url = (obj: any) =>
    btoa(JSON.stringify(obj))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

  const encodedHeader = base64Url(header);
  const encodedPayload = base64Url(payload);

  const data = `${encodedHeader}.${encodedPayload}`;

  // Sign using ECDSA
  const signature = await crypto.subtle.sign(
    {
      name: 'ECDSA',
      hash: 'SHA-256',
    },
    privateKey,
    encoder.encode(data)
  );

  const signatureBase64 = btoa(
    String.fromCharCode(...new Uint8Array(signature))
  )
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  return `${data}.${signatureBase64}`;
}

// In-memory key pair manager
let currentKeyPair: CryptoKeyPair | null = null;
const KEY_ID = 'default_dpop_key';

export const dpopManager = {
  // 1. Explicit Initialization
  init: async () => {
    try {
      const db = await getDB();
      const tx = db.transaction(DPOP_KEYS_STORE, 'readonly');
      const store = tx.objectStore(DPOP_KEYS_STORE);
      const req = store.get(KEY_ID);

      return new Promise<void>((resolve) => {
        req.onsuccess = () => {
          if (req.result) {
            currentKeyPair = req.result;
            console.log('[DPoP] Successfully loaded existing key pair from IndexedDB');
          } else {
            console.log('[DPoP] No existing key pair found in database');
          }
          resolve();
        };
        req.onerror = () => {
          console.error('[DPoP] Failed to load key pair from DB:', req.error);
          resolve();
        };
      });
    } catch (err) {
      console.error('[DPoP] IndexedDB init failed:', err);
    }
  },

  // 2. Set/Save
  setKeyPair: async (keyPair: CryptoKeyPair) => {
    currentKeyPair = keyPair;
    try {
      const db = await getDB();
      const tx = db.transaction(DPOP_KEYS_STORE, 'readwrite');
      const store = tx.objectStore(DPOP_KEYS_STORE);
      store.put(keyPair, KEY_ID);
    } catch (err) {
      console.error('[DPoP] Failed to persist key pair:', err);
    }
  },

  getKeyPair: () => currentKeyPair,

  // 3. Generate with persistence & "No Regeneration" rule
  generateAndSetKeyPair: async () => {
    // DESIGN RULE: Never regenerate if one already exists
    if (!currentKeyPair) {
      // Re-check DB if memory is empty
      await dpopManager.init();
    }

    if (currentKeyPair) {
      return currentKeyPair;
    }

    const keyPair = await generateKeyPair();
    await dpopManager.setKeyPair(keyPair);
    return keyPair;
  }
};
