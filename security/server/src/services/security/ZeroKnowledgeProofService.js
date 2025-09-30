const crypto = require('crypto');
const bigInt = require('big-integer');

class ZeroKnowledgeProofService {
  constructor() {
    this.challenges = new Map();
    this.setupSRP();
  }

  setupSRP() {
    // SRP-6a parameters
    this.N = bigInt("FFFFFFFFFFFFFFFFC90FDAA22168C234C4C6628B80DC1CD129024E088A67CC74020BBEA63B139B22514A08798E3404DDEF9519B3CD3A431B302B0A6DF25F14374FE1356D6D51C245E485B576625E7EC6F44C42E9A637ED6B0BFF5CB6F406B7EDEE386BFB5A899FA5AE9F24117C4B1FE649286651ECE45B3DC2007CB8A163BF0598DA48361C55D39A69163FA8FD24CF5F83655D23DCA3AD961C62F356208552BB9ED529077096966D670C354E4ABC9804F1746C08CA18217C32905E462E36CE3BE39E772C180E86039B2783A2EC07A28FB5C55DF06F4C52C9DE2BCBF6955817183995497CEA956AE515D2261898FA051015728E5A8AACAA68FFFFFFFFFFFFFFFF", 16);
    this.g = bigInt(2);
    this.k = bigInt(3);
    this.hashLength = 256;
  }

  // Client-side: Generate verifier for password
  async generateVerifier(username, password, salt = null) {
    salt = salt || crypto.randomBytes(32);
    
    // x = H(salt || H(username || ":" || password))
    const innerHash = this.hash(Buffer.concat([
      Buffer.from(username),
      Buffer.from(':'),
      Buffer.from(password)
    ]));
    
    const x = bigInt(this.hash(Buffer.concat([salt, innerHash])), 16);
    
    // v = g^x mod N
    const v = this.g.modPow(x, this.N);
    
    return {
      salt: salt.toString('hex'),
      verifier: v.toString(16)
    };
  }

  // Server-side: Start authentication
  async createChallenge(username, clientPublicKey) {
    const A = bigInt(clientPublicKey, 16);
    
    // Verify A != 0
    if (A.equals(0)) {
      throw new Error('Invalid client public key');
    }

    // Generate server ephemeral
    const b = bigInt(crypto.randomBytes(32).toString('hex'), 16);
    const B = this.k.multiply(bigInt(this.getStoredVerifier(username), 16))
      .add(this.g.modPow(b, this.N))
      .mod(this.N);

    // Store challenge
    const challengeId = crypto.randomUUID();
    this.challenges.set(challengeId, {
      username,
      A: A.toString(16),
      B: B.toString(16),
      b: b.toString(16),
      timestamp: Date.now()
    });

    // Clean old challenges
    this.cleanupChallenges();

    return {
      challengeId,
      serverPublicKey: B.toString(16),
      salt: this.getStoredSalt(username)
    };
  }

  // Client-side: Generate proof
  async generateProof(username, password, salt, serverPublicKey, clientPrivate) {
    const B = bigInt(serverPublicKey, 16);
    const a = bigInt(clientPrivate, 16);
    const A = this.g.modPow(a, this.N);
    
    // u = H(A || B)
    const u = bigInt(this.hash(Buffer.concat([
      Buffer.from(A.toString(16), 'hex'),
      Buffer.from(B.toString(16), 'hex')
    ])), 16);

    // x = H(salt || H(username || ":" || password))
    const innerHash = this.hash(Buffer.concat([
      Buffer.from(username),
      Buffer.from(':'),
      Buffer.from(password)
    ]));
    const x = bigInt(this.hash(Buffer.concat([
      Buffer.from(salt, 'hex'),
      innerHash
    ])), 16);

    // S = (B - k*g^x) ^ (a + u*x) mod N
    const S = B.subtract(this.k.multiply(this.g.modPow(x, this.N)))
      .modPow(a.add(u.multiply(x)), this.N);

    // K = H(S)
    const K = this.hash(Buffer.from(S.toString(16), 'hex'));

    // M1 = H(H(N) XOR H(g) || H(username) || salt || A || B || K)
    const M1 = this.generateM1(username, salt, A.toString(16), B.toString(16), K);

    return {
      proof: M1.toString('hex'),
      sessionKey: K.toString('hex')
    };
  }

  // Server-side: Verify proof
  async verifyProof(challengeId, proof) {
    const challenge = this.challenges.get(challengeId);
    
    if (!challenge) {
      throw new Error('Challenge not found or expired');
    }

    const A = bigInt(challenge.A, 16);
    const B = bigInt(challenge.B, 16);
    const b = bigInt(challenge.b, 16);
    const v = bigInt(this.getStoredVerifier(challenge.username), 16);
    
    // u = H(A || B)
    const u = bigInt(this.hash(Buffer.concat([
      Buffer.from(challenge.A, 'hex'),
      Buffer.from(challenge.B, 'hex')
    ])), 16);

    // S = (A * v^u) ^ b mod N
    const S = A.multiply(v.modPow(u, this.N)).modPow(b, this.N);

    // K = H(S)
    const K = this.hash(Buffer.from(S.toString(16), 'hex'));

    // Calculate expected M1
    const salt = this.getStoredSalt(challenge.username);
    const expectedM1 = this.generateM1(
      challenge.username,
      salt,
      challenge.A,
      challenge.B,
      K
    );

    // Verify proof
    const valid = crypto.timingSafeEqual(
      Buffer.from(proof, 'hex'),
      expectedM1
    );

    if (valid) {
      // Generate M2 for mutual authentication
      const M2 = this.hash(Buffer.concat([
        Buffer.from(challenge.A, 'hex'),
        Buffer.from(proof, 'hex'),
        K
      ]));

      // Clean up challenge
      this.challenges.delete(challengeId);

      return {
        valid: true,
        serverProof: M2.toString('hex'),
        sessionKey: K.toString('hex')
      };
    }

    return { valid: false };
  }

  // Generate Schnorr proof for ownership
  async generateSchnorrProof(secret, message) {
    const x = bigInt(secret, 16);
    
    // Commitment
    const r = bigInt(crypto.randomBytes(32).toString('hex'), 16);
    const R = this.g.modPow(r, this.N);
    
    // Challenge
    const c = bigInt(this.hash(Buffer.concat([
      Buffer.from(R.toString(16), 'hex'),
      Buffer.from(message)
    ])), 16);
    
    // Response
    const s = r.add(c.multiply(x)).mod(this.N.subtract(1));
    
    return {
      commitment: R.toString(16),
      response: s.toString(16)
    };
  }

  async verifySchnorrProof(publicKey, message, proof) {
    const Y = bigInt(publicKey, 16);
    const R = bigInt(proof.commitment, 16);
    const s = bigInt(proof.response, 16);
    
    // Reconstruct challenge
    const c = bigInt(this.hash(Buffer.concat([
      Buffer.from(proof.commitment, 'hex'),
      Buffer.from(message)
    ])), 16);
    
    // Verify: g^s = R * Y^c mod N
    const left = this.g.modPow(s, this.N);
    const right = R.multiply(Y.modPow(c, this.N)).mod(this.N);
    
    return left.equals(right);
  }

  // Pedersen commitment for hiding values
  createCommitment(value, blinding = null) {
    const v = bigInt(value);
    const r = blinding ? bigInt(blinding, 16) : bigInt(crypto.randomBytes(32).toString('hex'), 16);
    
    // h = g^x mod N (where x is a secret)
    const h = this.g.modPow(bigInt(crypto.randomBytes(32).toString('hex'), 16), this.N);
    
    // C = g^v * h^r mod N
    const C = this.g.modPow(v, this.N).multiply(h.modPow(r, this.N)).mod(this.N);
    
    return {
      commitment: C.toString(16),
      blinding: r.toString(16),
      generator: h.toString(16)
    };
  }

  verifyCommitment(commitment, value, blinding, generator) {
    const C = bigInt(commitment, 16);
    const v = bigInt(value);
    const r = bigInt(blinding, 16);
    const h = bigInt(generator, 16);
    
    const expected = this.g.modPow(v, this.N).multiply(h.modPow(r, this.N)).mod(this.N);
    
    return C.equals(expected);
  }

  // Range proof (simplified Bulletproofs concept)
  async generateRangeProof(value, min, max) {
    if (value < min || value > max) {
      throw new Error('Value out of range');
    }

    // Simplified range proof using bit decomposition
    const bits = value.toString(2).padStart(32, '0').split('').map(Number);
    const commitments = [];
    const proofs = [];

    for (let i = 0; i < bits.length; i++) {
      const bit = bits[i];
      const commitment = this.createCommitment(bit);
      commitments.push(commitment);

      // Prove bit is 0 or 1
      const proof = await this.generateSchnorrProof(
        commitment.blinding,
        Buffer.from(`bit_${i}_is_${bit}`)
      );
      proofs.push(proof);
    }

    return {
      commitments,
      proofs,
      range: { min, max }
    };
  }

  hash(data) {
    return crypto.createHash('sha256').update(data).digest();
  }

  generateM1(username, salt, A, B, K) {
    const hN = this.hash(Buffer.from(this.N.toString(16), 'hex'));
    const hg = this.hash(Buffer.from(this.g.toString(16), 'hex'));
    
    const hNhg = Buffer.alloc(32);
    for (let i = 0; i < 32; i++) {
      hNhg[i] = hN[i] ^ hg[i];
    }

    return this.hash(Buffer.concat([
      hNhg,
      this.hash(Buffer.from(username)),
      Buffer.from(salt, 'hex'),
      Buffer.from(A, 'hex'),
      Buffer.from(B, 'hex'),
      K
    ]));
  }

  cleanupChallenges() {
    const now = Date.now();
    const timeout = 5 * 60 * 1000; // 5 minutes

    for (const [id, challenge] of this.challenges.entries()) {
      if (now - challenge.timestamp > timeout) {
        this.challenges.delete(id);
      }
    }
  }

  // Mock methods - replace with actual database calls
  getStoredVerifier(username) {
    // Return stored verifier from database
    return "mock_verifier";
  }

  getStoredSalt(username) {
    // Return stored salt from database
    return "mock_salt";
  }
}

module.exports = ZeroKnowledgeProofService;