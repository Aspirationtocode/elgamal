"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Crypto_1 = require("./Crypto");
describe("Crypto tests", () => {
    test("Encrypt and decrypt text", () => {
        const text = "I want to live forever";
        const { sec, pub } = Crypto_1.Crypto.generateKeyPair();
        const encryptedText = Crypto_1.Crypto.encrypt(text, pub);
        const decryptedText = Crypto_1.Crypto.decrypt(encryptedText, sec);
        expect(decryptedText).toBe(text);
    });
});
