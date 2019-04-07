import { Crypto } from "./Crypto";

const message = "How".repeat(15);
console.log(message);
// Get key pair
const keyPair = Crypto.generateKeyPair(128);
// Get encrypted message
const encryptedMessage = Crypto.encrypt(message, keyPair.pub);
// Get decrypted message
const decryptedMessage = Crypto.decrypt(encryptedMessage, keyPair.sec);
console.log(decryptedMessage);
