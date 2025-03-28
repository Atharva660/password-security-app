import { db, auth } from "../firebase";
import { 
  doc, 
  setDoc, 
  getDoc,
  collection,
  addDoc,
  query,
  getDocs,
  deleteDoc
} from "firebase/firestore";
import crypto from "crypto";
import { config } from "dotenv";

config();

// Encryption Key Configuration
const SECRET_KEY = process.env.REACT_APP_SECRET_KEY;
if (!SECRET_KEY) {
  console.error('Encryption key is not configured');
}
const SECRET_KEY_BUFFER = Buffer.from(SECRET_KEY, 'hex');

// AES-256 Encryption
export const encryptPassword = (password) => {
  if (!SECRET_KEY_BUFFER) {
    console.error('Secret key is not available for encryption');
    return null;
  }

  try {
    const IV_LENGTH = 16;
    const iv = crypto.randomBytes(IV_LENGTH);
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
export const decryptPassword = (encryptedData, iv) => {
  if (!SECRET_KEY_BUFFER) {
    console.error('Secret key is not available for decryption');
    return null;
  }

  try {
    const decipher = crypto.createDecipheriv(
      "aes-256-cbc", 
      SECRET_KEY_BUFFER, 
      Buffer.from(iv, "hex")
    );
    let decrypted = decipher.update(encryptedData, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  } catch (error) {
    console.error('Error decrypting password:', error);
    return null;
  }
};

// Save password to Firestore
export const savePasswordToDB = async (passwordData) => {
  const user = auth.currentUser;
  if (!user || !user.email) throw new Error("User not authenticated");

  const { encryptedData, iv } = encryptPassword(passwordData.password);
  if (!encryptedData || !iv) throw new Error("Encryption failed");

  try {
    const passwordsRef = collection(db, "users", user.email, "passwords");
    await addDoc(passwordsRef, {
      title: passwordData.title,
      username: passwordData.username,
      encryptedPassword: encryptedData,
      iv: iv,
      notes: passwordData.notes,
      category: passwordData.category,
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString()
    });
    return true;
  } catch (error) {
    console.error('Error saving password:', error);
    throw error;
  }
};

// Get all passwords for current user
export const getUserPasswords = async () => {
  const user = auth.currentUser;
  if (!user || !user.email) throw new Error("User not authenticated");

  try {
    const q = query(collection(db, "users", user.email, "passwords"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      password: "" // Don't decrypt automatically
    }));
  } catch (error) {
    console.error('Error getting passwords:', error);
    throw error;
  }
};

// Get and decrypt a specific password
export const getPasswordFromDB = async (passwordId) => {
  const user = auth.currentUser;
  if (!user || !user.email) throw new Error("User not authenticated");

  try {
    const docRef = doc(db, "users", user.email, "passwords", passwordId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) throw new Error("Password not found");

    const data = docSnap.data();
    const decrypted = decryptPassword(data.encryptedPassword, data.iv);
    if (!decrypted) throw new Error("Decryption failed");

    return {
      id: docSnap.id,
      ...data,
      password: decrypted
    };
  } catch (error) {
    console.error('Error retrieving password:', error);
    throw error;
  }
};

// Delete a password
export const deletePasswordFromDB = async (passwordId) => {
  const user = auth.currentUser;
  if (!user || !user.email) throw new Error("User not authenticated");

  try {
    const docRef = doc(db, "users", user.email, "passwords", passwordId);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error('Error deleting password:', error);
    throw error;
  }
};