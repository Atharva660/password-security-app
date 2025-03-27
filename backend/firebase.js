import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

const firebaseConfig = {
   apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
   authDomain: "passwordsecurityapp.firebaseapp.com",
   projectId: "passwordsecurityapp",
   storageBucket: "passwordsecurityapp.firebasestorage.app",
   messagingSenderId: "7421164332",
   appId: "1:7421164332:web:03882ba21d21890f5e8a89",
   measurementId: "G-425YXYTML1"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, setDoc, doc };
