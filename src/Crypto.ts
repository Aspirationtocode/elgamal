import { PrimeGenerator } from "./PrimeGenerator";
import * as BigInteger from "big-integer";
import { StringConverter } from "./StringConverter";

export interface SerializedKeyPair {
  pub: string;
  sec: string;
}

export interface EncryptedChunk {
  A: BigInteger.BigInteger;
  B: BigInteger.BigInteger;
}

export type EncryptedMessage = EncryptedChunk[];

export type Chunk = BigInteger.BigInteger;

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
  export function generateKeyPair(bits: number): any {
    // 1. Generate KeyPair
    // 1.1 Generate random primes (P, G)
    const P = PrimeGenerator.generatePrime(bits);
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

  export function encrypt(message: string | object, pubKey: string): string {
    const unserializedPubKey = Serializer.unserializePubKey(pubKey);
    const { P } = unserializedPubKey;
    const messageChunks = getChunksFromMessage(
      JSON.stringify(message),
      P.bitLength()
    );

    const encryptedMessage = messageChunks.map(chunk =>
      encryptChunk(chunk, unserializedPubKey)
    );

    const serializedEncryptedMessage = Serializer.serializeEncryptedMessage(
      encryptedMessage
    );
    return serializedEncryptedMessage;
  }

  function encryptChunk(chunk: BigInteger.BigInteger, pubKey: PubKey) {
    const { P, G, Y } = pubKey;
    const K = generateRandomGCDNumber(P);
    // 2. Get A = G^K mod P
    const A = G.modPow(K, P);
    // 3. Get B = Y^K * M mod P
    const B = Y.modPow(K, P)
      .multiply(chunk)
      .mod(P);

    const encryptedMessage: EncryptedChunk = {
      A,
      B
    };
    return encryptedMessage;
  }

  function getChunksFromMessage(
    message: string,
    bits: BigInteger.BigInteger
  ): Chunk[] {
    const chunks = [];
    let temporaryMessage = "";

    for (let i = 0; i < message.length; i += 1) {
      const messageChunk = temporaryMessage + message[i];
      const messageChunkInt = Serializer.getInteger(messageChunk);
      const messageChunkBitLength = messageChunkInt.bitLength();
      if (messageChunkBitLength.greaterOrEquals(bits)) {
        chunks.push(Serializer.getInteger(temporaryMessage));
        temporaryMessage = "";
      } else {
        temporaryMessage = messageChunk.toString();
      }
    }

    if (temporaryMessage) {
      return chunks.concat(Serializer.getInteger(temporaryMessage));
    }

    return chunks;
  }

  export function decrypt(message: string, secKey: string): string {
    const encryptedMessage = Serializer.unSerializeEncryptedMessage(message);

    const decryptedMessage = encryptedMessage.reduce((acc, encryptedChunk) => {
      const decryptedChunk = decryptChunk(encryptedChunk, secKey);

      return acc + Serializer.getString(decryptedChunk);
    }, "");
    return decryptedMessage;
  }

  function decryptChunk(encryptedChunk: EncryptedChunk, secKey: string): Chunk {
    const { X, P } = Serializer.unserializeSecKey(secKey);
    const { A, B } = encryptedChunk;

    const st = P.subtract(BigInteger(1)).subtract(X);

    const decryptedChunk = A.modPow(st, P)
      .multiply(B)
      .mod(P);
    return decryptedChunk;
  }

  export function unSerializeKeyPair(keyPair: SerializedKeyPair): KeyPair {
    return {
      pub: Serializer.unserializePubKey(keyPair.pub),
      sec: Serializer.unserializeSecKey(keyPair.sec)
    };
  }

  export function generateRandomGCDNumber(P: BigInteger.BigInteger) {
    let currentNumber = BigInteger.randBetween(Big(2), P);
    while (BigInteger.gcd(currentNumber, P.prev()).notEquals(Big(1))) {
      currentNumber = currentNumber.next();
    }
    return currentNumber;
  }

  function Big(num: string | number) {
    return BigInteger(num.toString());
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

  export function getInteger(str: string): BigInteger.BigInteger {
    return BigInteger(StringConverter.fromStringToHex(str), 16);
  }

  export function getString(int: Chunk): string {
    return StringConverter.fromHexToString(int.toString(16));
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
    encryptedMessage: EncryptedMessage
  ): string {
    return JSON.stringify(encryptedMessage);
  }

  export function unSerializeEncryptedMessage(
    encryptedMessage: string
  ): EncryptedMessage {
    const encryptedChunks = JSON.parse(encryptedMessage);
    const unSerializedEncryptedChunks = encryptedChunks.map(encryptedChunk =>
      unSerializeKeys(encryptedChunk)
    );
    return unSerializedEncryptedChunks as EncryptedMessage;
  }
}
