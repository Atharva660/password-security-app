import { db } from "../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import crypto from "crypto";
import { config } from "dotenv";
import { SECRET_KEY_BUFFER } from './secretKeyUtils';

config();

// Check if SECRET_KEY_BUFFER is available
if (!SECRET_KEY_BUFFER) {
  console.error('Secret key is not available');
}

// AES-256 Encryption
const encryptPassword = (password) => {
  if (!SECRET_KEY_BUFFER) {
    console.error('Secret key is not available for encryption');
    return null;
  }

  try {
    const IV_LENGTH = 16;  // AES IV length (128-bit)
    const iv = crypto.randomBytes(IV_LENGTH);  // Generate random IV
    const cipher = crypto.createCipheriv("aes-256-cbc", SECRET_KEY_BUFFER, iv);
    let encrypted = cipher.update(password, "utf8", "hex");
    encrypted += cipher.final("hex");
    return { encryptedData: encrypted, iv: iv.toString("hex") };
  } catch (error) {
    console.error('Error encrypting password:', error);
    return null;
  }
};

// AES-256 Decryption
const decryptPassword = (encryptedData, iv) => {
  if (!SECRET_KEY_BUFFER) {
    console.error('Secret key is not available for decryption');
    return null;
  }

  try {
    const decipher = crypto.createDecipheriv("aes-256-cbc", SECRET_KEY_BUFFER, Buffer.from(iv, "hex"));
    let decrypted = decipher.update(encryptedData, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  } catch (error) {
    console.error('Error decrypting password:', error);
    return null;
  }
};

// Save encrypted password in Firestore
export const savePasswordToDB = async (password) => {
  if (!password) {
    console.error('Password is empty');
    return;
  }

  const { encryptedData, iv } = encryptPassword(password);

  if (!encryptedData || !iv) {
    console.error('Failed to encrypt password');
    return;
  }

  // Log data before saving to Firestore
  console.log("Saving encrypted password to DB:", encryptedData, iv);

  try {
    const userId = "testUser";  // Replace with actual user ID
    await setDoc(doc(db, "securePasswords", userId), {
      encryptedPassword: encryptedData,
      iv: iv
    });
    console.log("Password saved successfully!");
  } catch (error) {
    console.error('Error saving password to Firestore:', error);
  }
};

// Get encrypted password from Firestore
export const getPasswordFromDB = async (userId) => {
  try {
    const docRef = doc(db, "securePasswords", userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      const { encryptedPassword, iv } = data;

      const decryptedPassword = decryptPassword(encryptedPassword, iv);
      if (!decryptedPassword) {
        console.error('Failed to decrypt password');
        return null;
      }

      return decryptedPassword;  // Returns the decrypted password
    } else {
      throw new Error("Password not found for user");
    }
  } catch (error) {
    console.error('Error retrieving password from Firestore:', error);
    return null;
  }
};
