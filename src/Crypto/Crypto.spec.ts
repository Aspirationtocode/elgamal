import { Crypto } from "./Crypto";

describe("Crypto tests", () => {
  test("Encrypt and decrypt text", () => {
    const text = "I want to live forever";
    const { sec, pub } = Crypto.generateKeyPair();
    const encryptedText = Crypto.encrypt(text, pub);
    const decryptedText = Crypto.decrypt(encryptedText, sec);

    expect(decryptedText).toBe(text);
  });
});
