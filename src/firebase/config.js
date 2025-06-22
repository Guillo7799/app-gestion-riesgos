// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
//import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCVn2H4QZ9gPwh3KWKqzKaP8In1lAgqVfs",
  authDomain: "gestor-activos.firebaseapp.com",
  projectId: "gestor-activos",
  storageBucket: "gestor-activos.firebasestorage.app",
  messagingSenderId: "437957038640",
  appId: "1:437957038640:web:f77162c7152fdf852493f5",
  //measurementId: "G-HKK23ZSMSL",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
//const analytics = getAnalytics(app);
export const db = getFirestore(app);
