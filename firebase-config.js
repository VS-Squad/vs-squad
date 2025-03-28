import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDvE0HFoMeP2UNxq7P5PBxCYpCm8rQaED8",
  authDomain: "student-tracker-4eb6b.firebaseapp.com",
  projectId: "student-tracker-4eb6b",
  storageBucket: "student-tracker-4eb6b.firebasestorage.app",
  messagingSenderId: "153210148651",
  appId: "1:153210148651:web:f5ce0c84d225e5bbf0976e",
  measurementId: "G-89NL7E2JS5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
