import { Crypto } from "./Crypto";

// Message (integer in our case)
const message = "How old are you?";
// Get key pair
const keyPair = Crypto.generateKeyPair(256);
// Get encrypted message
const encryptedMessage = Crypto.encrypt(message, keyPair.pub);
// Get decrypted message
const decryptedMessage = Crypto.decrypt(encryptedMessage, keyPair.sec);
console.log(decryptedMessage);
// TODO: add verify (sha256)
