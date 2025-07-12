// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAA8UMKN6cTk3FmewMB46MGVoOJHbTagnk",
  authDomain: "ventabebidas-e554e.firebaseapp.com",
  projectId: "ventabebidas-e554e",
  storageBucket: "ventabebidas-e554e.firebasestorage.app",
  messagingSenderId: "673294089728",
  appId: "1:673294089728:web:0cf797fce985c0451ea2e5"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);