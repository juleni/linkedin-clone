// Import the functions you need from the SDKs you need
import { getFirestore } from "@firebase/firestore";
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA8E9CG15hjCtLvUydgECdJA9p_8Sgb9xA",
  authDomain: "linkedin-clone-69973.firebaseapp.com",
  projectId: "linkedin-clone-69973",
  storageBucket: "linkedin-clone-69973.appspot.com",
  messagingSenderId: "276209327771",
  appId: "1:276209327771:web:4e915f3a8c20af803ef03e",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth();
const provider = new GoogleAuthProvider();
// Initialize Cloud Storage and get a reference to the service
const storage = getStorage(app);

export { auth, provider, storage };
export default db;
