import { Crypto } from "./Crypto";

// Message (integer in our case)
const message = 20;
// Get key pair
const keyPair = Crypto.generateKeyPair();
// Get encrypted message
const encryptedMessage = Crypto.encrypt(message, keyPair.pub);
// Get decrypted message
const decryptedMessage = Crypto.decrypt(encryptedMessage, keyPair.sec);
console.log(decryptedMessage);
