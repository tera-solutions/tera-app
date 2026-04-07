import CryptoJS from "crypto-js";
import { config } from "@tera/commons/constants/common";

export function CryptoJSAesEncrypt(plain_text, privateKey = config.privateKey) {
  try {
    const salt = CryptoJS.lib.WordArray.random(256);
    const iv = CryptoJS.lib.WordArray.random(16);

    const key = CryptoJS.PBKDF2(privateKey, salt, {
      hasher: CryptoJS.algo.SHA256,
      keySize: 64 / 8,
      iterations: 999,
    });

    const formatData = JSON.stringify(plain_text);
    const encrypted = CryptoJS.AES.encrypt(formatData, key, { iv });

    const data = {
      da: CryptoJS.enc.Base64.stringify(encrypted.ciphertext),
      salt: CryptoJS.enc.Hex.stringify(salt),
      iv: CryptoJS.enc.Hex.stringify(iv),
    };

    return data;
  } catch (err) {
    console.error(err);
    return null;
  }
}

export const decrypt = ({ hash, salt, iv }, privateKey = config.privateKey) => {
  try {
    if (!hash) throw new Error("Không tìm thấy dữ liệu");
    if (!salt) throw new Error("Không tìm thấy dữ liệu");
    if (!iv) throw new Error("Không tìm thấy dữ liệu");
    console.log("salt", CryptoJS.enc.Hex.parse(salt));

    const key = CryptoJS.PBKDF2(privateKey, CryptoJS.enc.Hex.parse(salt), {
      hasher: CryptoJS.algo.SHA256,
      keySize: 64 / 8,
      iterations: 999,
    });

    console.log("dash", CryptoJS.enc.Base64.parse(hash));

    const decipher = CryptoJS.AES.decrypt(
      { ciphertext: CryptoJS.enc.Base64.parse(hash) },
      key,
      { iv: CryptoJS.enc.Hex.parse(iv) },
    );
    const decryptedData = decipher.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decryptedData);
  } catch (err) {
    console.error(err);
    throw err;
  }
};
