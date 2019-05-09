"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Crypto_1 = require("./Crypto");
const message = "Я люблю Катюшу!";
// Get key pair
const keyPair = Crypto_1.Crypto.generateKeyPair(256);
// Encrypt message public key
const encryptedMessage = Crypto_1.Crypto.encrypt(message, keyPair.pub);
// Decrypt message with secret key
const decryptedMessage = Crypto_1.Crypto.decrypt(encryptedMessage, keyPair.sec);
console.log(decryptedMessage);
