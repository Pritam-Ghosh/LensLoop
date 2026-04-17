// firebaseConfig.js
// Firebase Modular SDK (NO WARNINGS)
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your firebaseConfig from console
const firebaseConfig = {
  apiKey: "AIzaSyCEitlvzrpHS2G1tQ6DYHHNBZ-Y-eNKKFE",
  authDomain: "snaphive-81e25.firebaseapp.com",
  projectId: "snaphive-81e25",
  storageBucket: "snaphive-81e25.firebasestorage.app",
  messagingSenderId: "50093232470",
  appId: "1:50093232470:web:46e26c05a7d82335aa46f7",
  measurementId: "G-3K919YJHBT" 
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);