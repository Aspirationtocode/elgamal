import { Crypto } from "./Crypto";

const message = JSON.stringify(
  Array.from({ length: 400 }).fill({ kek: "lol" })
);

// Get key pair
const keyPair = Crypto.generateKeyPair(256);

// Encrypt message public key
const encryptedMessage = Crypto.encrypt(message, keyPair.pub);
// Decrypt message with secret key
const decryptedMessage = Crypto.decrypt(encryptedMessage, keyPair.sec);
console.log(decryptedMessage);
