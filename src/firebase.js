import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { collection, addDoc } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyARKxDPmobtWfVDYWugM4VNoEd2X2puFKE",
  authDomain: "symphony-f37ae.firebaseapp.com",
  projectId: "symphony-f37ae",
  storageBucket: "symphony-f37ae.appspot.com",
  messagingSenderId: "1028726993387",
  appId: "1:1028726993387:web:8dd1e3a88b96a028a4e9ae",
  measurementId: "G-YFJZ66VWG0"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db, collection, addDoc };