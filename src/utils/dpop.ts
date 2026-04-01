
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

export const dpopManager = {
  setKeyPair: (keyPair: CryptoKeyPair) => {
    currentKeyPair = keyPair;
  },
  getKeyPair: () => currentKeyPair,
  generateAndSetKeyPair: async () => {
    const keyPair = await generateKeyPair();
    currentKeyPair = keyPair;
    return keyPair;
  }
};
