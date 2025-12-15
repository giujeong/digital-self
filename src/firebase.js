import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAyGrbe_00JIQn42YtLAqsHKMz-JYV02xg",
  authDomain: "giujeong-me.firebaseapp.com",
  projectId: "giujeong-me",
  storageBucket: "giujeong-me.firebasestorage.app",
  messagingSenderId: "227305255684",
  appId: "1:227305255684:web:7caead9585bcd0c1ba9651",
  measurementId: "G-6Y97NQSH8P"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
