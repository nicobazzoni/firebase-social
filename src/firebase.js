// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import firebase from "firebase/compat/app";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCRgZ9yY4J4S5hWSxLsyAIeZ8igVHrJxBw",
  authDomain: "fir-social-bdb17.firebaseapp.com",
  projectId: "fir-social-bdb17",
  storageBucket: "fir-social-bdb17.appspot.com",
  messagingSenderId: "905318547891",
  appId: "1:905318547891:web:8f12b7bf2517d329778bc6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const database = getDatabase(app);

export { firebaseConfig, auth, db, storage, database };
export default firebase;