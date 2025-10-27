// Import Firebase SDK
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// 🔥 IMPORTANT: Replace this with YOUR Firebase config from Step 5
const firebaseConfig = {
  apiKey: "AIzaSyDLY4K5QdwcnrcRMRyqAAnGL1CtRgFk4Nw",
  authDomain: "saamaan-c0c6a.firebaseapp.com",
  projectId: "saamaan-c0c6a",
  storageBucket: "saamaan-c0c6a.firebasestorage.app",
  messagingSenderId: "124530571275",
  appId: "1:124530571275:web:39c53b30227afaa95cef0e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
