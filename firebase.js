// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCMYd_e2ta4a2UjU-2Pn9LqFUnaIm0yCQY",
  authDomain: "tinder-1a201.firebaseapp.com",
  projectId: "tinder-1a201",
  storageBucket: "tinder-1a201.appspot.com",
  messagingSenderId: "1042839886997",
  appId: "1:1042839886997:web:74424fc991b2f54ccecf9c",
  measurementId: "G-HJ5BXF5L61",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const auth = getAuth();
export const db = getFirestore();
export const storage = getStorage(app);
