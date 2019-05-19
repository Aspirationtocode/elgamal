"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const PrimeGenerator_1 = require("../PrimeGenerator");
const BigInteger = require("big-integer");
const StringConverter_1 = require("../StringConverter");
var Crypto;
(function (Crypto) {
    function generateKeyPair(bits = 256) {
        const P = PrimeGenerator_1.PrimeGenerator.generatePrime(bits);
        const G = generateRandomGCDNumber(P);
        const X = generateRandomGCDNumber(P);
        const Y = G.modPow(X, P);
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
    Crypto.generateKeyPair = generateKeyPair;
    function encrypt(message, pubKey) {
        const unserializedPubKey = Serializer.unserializePubKey(pubKey);
        const { P } = unserializedPubKey;
        const messageChunks = getChunksFromMessage(message, P.bitLength());
        const encryptedMessage = messageChunks.map(chunk => encryptChunk(chunk, unserializedPubKey));
        const serializedEncryptedMessage = Serializer.serializeEncryptedMessage(encryptedMessage);
        return serializedEncryptedMessage;
    }
    Crypto.encrypt = encrypt;
    function encryptChunk(chunk, pubKey) {
        const { P, G, Y } = pubKey;
        const K = generateRandomGCDNumber(P);
        const A = G.modPow(K, P);
        const B = Y.modPow(K, P)
            .multiply(chunk)
            .mod(P);
        const encryptedMessage = {
            A,
            B
        };
        return encryptedMessage;
    }
    function getChunksFromMessage(message, bits) {
        const chunks = [];
        let temporaryMessage = "";
        for (let i = 0; i < message.length; i += 1) {
            const messageChunk = temporaryMessage + message[i];
            const messageChunkInt = Serializer.getInteger(messageChunk);
            const messageChunkBitLength = messageChunkInt.bitLength();
            if (messageChunkBitLength.greaterOrEquals(bits)) {
                chunks.push(Serializer.getInteger(temporaryMessage));
                temporaryMessage = message[i];
            }
            else {
                temporaryMessage = messageChunk.toString();
            }
        }
        const result = temporaryMessage
            ? chunks.concat(Serializer.getInteger(temporaryMessage))
            : chunks;
        return result;
    }
    function decrypt(message, secKey) {
        const encryptedMessage = Serializer.unSerializeEncryptedMessage(message);
        const decryptedMessage = encryptedMessage.reduce((acc, encryptedChunk) => {
            const decryptedChunk = decryptChunk(encryptedChunk, secKey);
            return acc + Serializer.getString(decryptedChunk);
        }, "");
        return decryptedMessage;
    }
    Crypto.decrypt = decrypt;
    function decryptChunk(encryptedChunk, secKey) {
        const { X, P } = Serializer.unserializeSecKey(secKey);
        const { A, B } = encryptedChunk;
        const st = P.subtract(BigInteger(1)).subtract(X);
        const decryptedChunk = A.modPow(st, P)
            .multiply(B)
            .mod(P);
        return decryptedChunk;
    }
    function unSerializeKeyPair(keyPair) {
        return {
            pub: Serializer.unserializePubKey(keyPair.pub),
            sec: Serializer.unserializeSecKey(keyPair.sec)
        };
    }
    Crypto.unSerializeKeyPair = unSerializeKeyPair;
    function generateRandomGCDNumber(P) {
        let currentNumber = BigInteger.randBetween(Big(2), P);
        while (BigInteger.gcd(currentNumber, P.prev()).notEquals(Big(1))) {
            currentNumber = currentNumber.next();
        }
        return currentNumber;
    }
    Crypto.generateRandomGCDNumber = generateRandomGCDNumber;
    function Big(num) {
        return BigInteger(num.toString());
    }
})(Crypto = exports.Crypto || (exports.Crypto = {}));
var Serializer;
(function (Serializer) {
    function unSerializeKeys(obj) {
        const finalObject = {};
        Object.keys(obj).forEach(key => {
            finalObject[key] = BigInteger(`${obj[key]}`);
        });
        return finalObject;
    }
    function getInteger(str) {
        return BigInteger(StringConverter_1.StringConverter.fromStringToHex(str), 16);
    }
    Serializer.getInteger = getInteger;
    function getString(int) {
        return StringConverter_1.StringConverter.fromHexToString(int.toString(16));
    }
    Serializer.getString = getString;
    function serializePubKey(key) {
        return JSON.stringify(key);
    }
    Serializer.serializePubKey = serializePubKey;
    function unserializePubKey(key) {
        return unSerializeKeys(JSON.parse(key));
    }
    Serializer.unserializePubKey = unserializePubKey;
    function serializeSecKey(key) {
        return JSON.stringify(key);
    }
    Serializer.serializeSecKey = serializeSecKey;
    function unserializeSecKey(key) {
        return unSerializeKeys(JSON.parse(key));
    }
    Serializer.unserializeSecKey = unserializeSecKey;
    function serializeEncryptedMessage(encryptedMessage) {
        return JSON.stringify(encryptedMessage);
    }
    Serializer.serializeEncryptedMessage = serializeEncryptedMessage;
    function unSerializeEncryptedMessage(encryptedMessage) {
        const encryptedChunks = JSON.parse(encryptedMessage);
        const unSerializedEncryptedChunks = encryptedChunks.map(encryptedChunk => unSerializeKeys(encryptedChunk));
        return unSerializedEncryptedChunks;
    }
    Serializer.unSerializeEncryptedMessage = unSerializeEncryptedMessage;
})(Serializer = exports.Serializer || (exports.Serializer = {}));
