import { Crypto } from "./Crypto";
import { StringConverter } from "./StringConverter";

const message = "123456".repeat(7);
// Get key pair
const keyPair = Crypto.generateKeyPair(256);
// Get encrypted message
const encryptedMessage = Crypto.encrypt(message, keyPair.pub);
// Get decrypted message
const decryptedMessage = Crypto.decrypt(encryptedMessage, keyPair.sec);
console.log(decryptedMessage);
