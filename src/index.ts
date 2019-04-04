import { Crypto } from "./Crypto";

// Message (integer in our case)
const message = "How old are you?";
// Get key pair
const keyPair = Crypto.generateKeyPair();
// Get encrypted message
const encryptedMessage = Crypto.encrypt(message, keyPair.pub);
console.log(encryptedMessage);
// Get decrypted message
const decryptedMessage = Crypto.decrypt(encryptedMessage, keyPair.sec);
console.log(decryptedMessage);
