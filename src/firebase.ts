import { getApps, initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore"; // Import Firestore

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDvvQVjN6y3sUKtUIpowrDgwKk57VJp_TY",
  authDomain: "image-uploader-6a560.firebaseapp.com",
  projectId: "image-uploader-6a560",
  storageBucket: "image-uploader-6a560.appspot.com",
  messagingSenderId: "678431621473",
  appId: "1:678431621473:web:dbde12f068f5ba1a24c520"
};

// Initialize Firebase
let app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const storage = getStorage(app);
export const db = getFirestore(app); // Export Firestore

export default app;
