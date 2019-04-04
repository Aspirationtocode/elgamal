import { PrimeGenerator } from "./PrimeGenerator";
import * as BigInteger from "big-integer";
import { isString } from "util";

export interface SerializedKeyPair {
  pub: string;
  sec: string;
}

export interface EncryptedChunk {
  A: BigInteger.BigInteger;
  B: BigInteger.BigInteger;
}

export interface KeyPair {
  pub: PubKey;
  sec: SecKey;
}

export interface PubKey {
  P: BigInteger.BigInteger;
  G: BigInteger.BigInteger;
  Y: BigInteger.BigInteger;
}

export interface SecKey {
  X: BigInteger.BigInteger;
  P: BigInteger.BigInteger;
}

export namespace Crypto {
  export function generateKeyPair(): any {
    // 1. Generate KeyPair
    // 1.1 Generate random primes (P, G)
    const P = PrimeGenerator.generatePrime(256);
    const G = generateRandomGCDNumber(P);
    // 1.2 Generate random number X, where (1 < X < P)
    const X = generateRandomGCDNumber(P);
    // 1.3 Get Y = q^x mod p
    const Y = G.modPow(X, P);

    // 1.4 Get KeyPair
    const pub = Serializer.serializePubKey({
      P,
      G,
      Y
    });
    const sec = Serializer.serializeSecKey({
      X,
      P
    });
    return {
      pub,
      sec
    };
  }

  export function encrypt(message: string, pubKey: string): string {
    const encryptedMessageChunks = message.split("").map(chunk => {
      const encryptedChunk = encryptChunk(Big(chunk.charCodeAt(0)), pubKey);
      return encryptedChunk;
    });
    return Serializer.serializeEncryptedMessage(encryptedMessageChunks);
  }

  function encryptChunk(
    chunk: BigInteger.BigInteger,
    pubKey: string
  ): EncryptedChunk {
    const { P, G, Y } = Serializer.unserializePubKey(pubKey);
    // 1. Get K (1 < k < (p - 1))
    const K = generateRandomGCDNumber(P);
    // 2. Get A = G^K mod P
    const A = G.modPow(K, P);
    // 3. Get B = Y^K * M mod P

    const B = Y.modPow(K, P)
      .multiply(chunk)
      .mod(P);

    const encryptedChunk: EncryptedChunk = {
      A,
      B
    };

    return encryptedChunk;
  }

  export function decrypt(message: string, secKey: string): string {
    const encryptedChunks = Serializer.unSerializeEncryptedMessage(message);
    return encryptedChunks
      .map(encryptedChunk => {
        const decryptedChunk = decryptChunk(encryptedChunk, secKey);
        return String.fromCharCode(decryptedChunk.toJSNumber());
      })
      .join("");
  }

  function decryptChunk(encryptedChunk: EncryptedChunk, secKey: string) {
    const { X, P } = Serializer.unserializeSecKey(secKey);
    const { A, B } = encryptedChunk;

    const st = P.subtract(BigInteger(1)).subtract(X);

    const result = A.modPow(st, P)
      .multiply(B)
      .mod(P);

    return result;
  }

  export function unSerializeKeyPair(keyPair: SerializedKeyPair): KeyPair {
    return {
      pub: Serializer.unserializePubKey(keyPair.pub),
      sec: Serializer.unserializeSecKey(keyPair.sec)
    };
  }

  export function generateRandomGCDNumber(P: BigInteger.BigInteger) {
    let currentNumber = Big(2);
    while (BigInteger.gcd(currentNumber, P.prev()).notEquals(Big(1))) {
      currentNumber = currentNumber.next();
    }
    return currentNumber;
  }

  function Big(num: string | number) {
    if (isString(num)) {
      return BigInteger(num);
    }
    return BigInteger(`${num}`);
  }
}

export module Serializer {
  function unSerializeKeys(obj: object) {
    const finalObject = {};
    Object.keys(obj).forEach(key => {
      finalObject[key] = BigInteger(`${obj[key]}`);
    });
    return finalObject;
  }

  export function serializePubKey(key: PubKey): string {
    return JSON.stringify(key);
  }

  export function unserializePubKey(key: string): PubKey {
    return unSerializeKeys(JSON.parse(key)) as PubKey;
  }

  export function serializeSecKey(key: SecKey): string {
    return JSON.stringify(key);
  }

  export function unserializeSecKey(key: string): SecKey {
    return unSerializeKeys(JSON.parse(key)) as SecKey;
  }

  export function serializeEncryptedMessage(
    encryptedMessage: EncryptedChunk[]
  ): string {
    return JSON.stringify(encryptedMessage);
  }

  export function unSerializeEncryptedMessage(
    encryptedMessage: string
  ): EncryptedChunk[] {
    const encryptedChunksArray = JSON.parse(encryptedMessage);
    return encryptedChunksArray.map(c =>
      unSerializeKeys(c)
    ) as EncryptedChunk[];
  }
}
