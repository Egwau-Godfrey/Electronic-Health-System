// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore"
import { getAnalytics } from "firebase/analytics";
import { getStorage, ref } from "firebase/storage";
import { getAuth, createUserWithEmailAndPassword, initializeAuth, signInWithEmailAndPassword } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD_5mNUTOJ_ErFuTnCiI1SxHwHR1mhjADU",
  authDomain: "ehrs-5a8c4.firebaseapp.com",
  projectId: "ehrs-5a8c4",
  storageBucket: "ehrs-5a8c4.appspot.com",
  messagingSenderId: "996075975539",
  appId: "1:996075975539:web:28cec25e91aa2c5867cb06",
  measurementId: "G-6WJJWLGLME"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const useFirestore = getFirestore(app);
const analytics = getAnalytics(app);
const storage = getStorage(app);
const auth = getAuth(app);


export { storage, auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, useFirestore };