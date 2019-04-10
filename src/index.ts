import { Crypto } from "./Crypto";

const message = Array.from({ length: 10 }).fill({ kek: "123" });
// Get key pair
const keyPair = Crypto.generateKeyPair(1024);
// Get encrypted message
const encryptedMessage = Crypto.encrypt(message, keyPair.pub);
// Get decrypted message
const decryptedMessage = Crypto.decrypt(encryptedMessage, keyPair.sec);
console.log(decryptedMessage);
