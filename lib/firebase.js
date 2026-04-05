// Import Firebase
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // ✅ ADD THIS

const firebaseConfig = {
  apiKey: "AIzaSyD8XvEi2MM4wI7g_VfN4ZxNuG8h_x3NIrY",
  authDomain: "closetai-website.firebaseapp.com",
  databaseURL: "https://closetai-website-default-rtdb.firebaseio.com",
  projectId: "closetai-website",
  storageBucket: "closetai-website.firebasestorage.app",
  messagingSenderId: "418357063511",
  appId: "1:418357063511:web:16e6ff116a4d19e1701812"
};

// Initialize
const app = initializeApp(firebaseConfig);

// Export services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app); // ✅ ADD THIS