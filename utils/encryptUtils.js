// utils/encryptUtils.js
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();


const algorithm = "aes-256-cbc";
const secretKey = process.env.ENCRYPTION_KEY || '12345678901234567890123456793392';
const iv = crypto.randomBytes(16);

// console.log(secretKey);

export const encrypt = (data) => {
    const jsonData = JSON.stringify(data);
    const cipher = crypto.createCipheriv(algorithm, Buffer.from(secretKey), iv);
    let encrypted = cipher.update(jsonData);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString("hex") + ":" + encrypted.toString("hex");
};

export const decrypt = (data) => {
    const [ivHex, encryptedData] = data.split(":");
    const ivBuffer = Buffer.from(ivHex, "hex");
    const encryptedBuffer = Buffer.from(encryptedData, "hex");
    const decipher = crypto.createDecipheriv(algorithm, Buffer.from(secretKey), ivBuffer);
    let decrypted = decipher.update(encryptedBuffer);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return JSON.parse(decrypted.toString());
};
