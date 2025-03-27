import { db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import sha512 from "crypto-js/sha512";
import crypto from "crypto";
import { convertToDevnagri } from "./devnagriEncoder";

// Generate a 64-byte random salt
const generateSalt = () => {
    return crypto.randomBytes(64).toString("hex");  // 512-bit salt
};

// Apply SHA-512 hashing with 200,000 iterations
const hashPassword = (password, salt, iterations = 200000) => {
    let hashed = password + salt;

    for (let i = 0; i < iterations; i++) {
        hashed = sha512(hashed).toString();
    }

    return hashed;
};

// Save password securely in Firestore
export const savePasswordToDB = async (password) => {
    const userId = "testUser";  // Replace with actual user ID
    const devnagriPassword = convertToDevnagri(password);
    const salt = generateSalt();
    const hashedPassword = hashPassword(devnagriPassword, salt);

    await setDoc(doc(db, "securePasswords", userId), {
        hashedPassword: hashedPassword,
        salt: salt
    });
};
