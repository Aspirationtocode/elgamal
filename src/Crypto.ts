import * as NumberTheory from "number-theory";
import { PrimeGenerator } from "./PrimeGenerator";
import * as BigInteger from "big-integer";

export interface SerializedKeyPair {
  pub: string;
  sec: string;
}

export interface EncrypredMessage {
  A: number;
  B: number;
}

export interface KeyPair {
  pub: PubKey;
  sec: SecKey;
}

export interface PubKey {
  P: number;
  G: number;
  Y: number;
}

export interface SecKey {
  X: number;
  P: number;
}

export namespace Crypto {
  export function generateKeyPair(): SerializedKeyPair {
    // 1. Generate KeyPair
    // 1.1 Generate random primes (P, G)
    const P = PrimeGenerator.generatePrime(6);
    const G = NumberTheory.primitiveRoot(P);

    // 1.2 Generate random number X, where (1 < X < P)
    const X = generateRandomGCDNumber(P);
    // 1.3 Get Y = q^x mod p
    const Y = getY(P, G, X);
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

  export function getY(P: number, G: number, X: number): number {
    return G ** X % P;
  }

  export function encrypt(message: number, pubKey: string): string {
    const { P, G, Y } = Serializer.unserializePubKey(pubKey);
    // 1. Get K (1 < k < (p - 1))
    const K = generateRandomGCDNumber(P);
    // 2. Get A = G^K mod P
    const A = G ** K % P;
    // 3. Get B = Y^K * M mod P
    const B = (Y ** K * message) % P;
    const encryptedMessage: EncrypredMessage = {
      A,
      B
    };

    return Serializer.serializeEncryptedMessage(encryptedMessage);
  }

  export function decrypt(message: string, secKey: string) {
    const { X, P } = Serializer.unserializeSecKey(secKey);
    const { A, B } = Serializer.unSerializeEncryptedMessage(message);

    const bX = BigInteger(`${X}`);
    const bP = BigInteger(`${P}`);
    const bA = BigInteger(`${A}`);
    const bB = BigInteger(`${B}`);

    const st = bP.subtract(BigInteger(1)).subtract(bX);

    return bB.multiply(bA.pow(st)).mod(bP);
  }

  export function unSerializeKeyPair(keyPair: SerializedKeyPair): KeyPair {
    return {
      pub: Serializer.unserializePubKey(keyPair.pub),
      sec: Serializer.unserializeSecKey(keyPair.sec)
    };
  }

  export function generateRandomGCDNumber(P: number) {
    for (let i = 2; i < P; i += 1) {
      if (NumberTheory.gcd(i, P - 1) === 1) {
        return i;
      }
    }
  }
}

export module Serializer {
  export function serializePubKey(key: PubKey): string {
    return JSON.stringify(key);
  }

  export function unserializePubKey(key: string): PubKey {
    return JSON.parse(key);
  }

  export function serializeSecKey(key: SecKey): string {
    return JSON.stringify(key);
  }

  export function unserializeSecKey(key: string): SecKey {
    return JSON.parse(key);
  }

  export function serializeEncryptedMessage(
    encryptedMessage: EncrypredMessage
  ) {
    return JSON.stringify(encryptedMessage);
  }

  export function unSerializeEncryptedMessage(
    encryptedMessage: string
  ): EncrypredMessage {
    return JSON.parse(encryptedMessage);
  }
}
