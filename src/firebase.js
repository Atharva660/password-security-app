// frontend/src/firebase.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, doc, setDoc, getDoc } from "firebase/firestore";


// Firebase configuration (import from .env file or replace manually)
const firebaseConfig = {
    apiKey: "AIzaSyBdrTuJYdZAXQayHvMtGO2pi3-QoNcQ7Yk",
    authDomain: "passwordsecurityapp.firebaseapp.com",
   projectId: "passwordsecurityapp",
   storageBucket: "passwordsecurityapp.firebasestorage.app",
   messagingSenderId: "7421164332",
   appId: "1:7421164332:web:03882ba21d21890f5e8a89",
   measurementId: "G-425YXYTML1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);

export { db, auth, collection, doc, setDoc, getDoc };