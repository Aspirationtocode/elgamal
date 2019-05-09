import * as BigInteger from "big-integer";
export interface SerializedKeyPair {
    pub: string;
    sec: string;
}
export interface EncryptedChunk {
    A: BigInteger.BigInteger;
    B: BigInteger.BigInteger;
}
export declare type EncryptedMessage = EncryptedChunk[];
export declare type Chunk = BigInteger.BigInteger;
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
export declare namespace Crypto {
    function generateKeyPair(bits?: number): SerializedKeyPair;
    function encrypt(message: string, pubKey: string): string;
    function decrypt(message: string, secKey: string): string;
    function unSerializeKeyPair(keyPair: SerializedKeyPair): KeyPair;
    function generateRandomGCDNumber(P: BigInteger.BigInteger): BigInteger.BigInteger;
}
export declare module Serializer {
    function getInteger(str: string): BigInteger.BigInteger;
    function getString(int: Chunk): string;
    function serializePubKey(key: PubKey): string;
    function unserializePubKey(key: string): PubKey;
    function serializeSecKey(key: SecKey): string;
    function unserializeSecKey(key: string): SecKey;
    function serializeEncryptedMessage(encryptedMessage: EncryptedMessage): string;
    function unSerializeEncryptedMessage(encryptedMessage: string): EncryptedMessage;
}
