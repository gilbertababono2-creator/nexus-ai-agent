import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAzlJbIug4I0Jyz0Kby_ViNXR2KsZjFekA",
  authDomain: "nexus-ai-d7e2e.firebaseapp.com",
  projectId: "nexus-ai-d7e2e",
  storageBucket: "nexus-ai-d7e2e.firebasestorage.app",
  messagingSenderId: "845181449601",
  appId: "845181449601"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
