import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAzlJbIug4I0Jyz0Kby_ViNXR2KsZjFekA",
  authDomain: "nexus-ai-d7e2e.firebaseapp.com",
  projectId: "nexus-ai-d7e2e",
  storageBucket: "nexus-ai-d7e2e.firebasestorage.app",
  messagingSenderId: "845181449601",
  appId: "1:845181449601:web:0e7523a88fdcbfde21e480",
  measurementId: "G-BL8T1CYBS8"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
