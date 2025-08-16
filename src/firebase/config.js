// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
//import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Configuración de Firebase
// Reemplaza los valores de abajo con tus propias credenciales de Firebase
// Puedes obtener estos datos desde la consola de Firebase en tu proyecto
const firebaseConfig = {
  apiKey: "TU_API_KEY_AQUI",
  authDomain: "TU_AUTH_DOMAIN_AQUI",
  projectId: "TU_PROJECT_ID_AQUI",
  storageBucket: "TU_STORAGE_BUCKET_AQUI",
  messagingSenderId: "TU_MESSAGING_SENDER_ID_AQUI",
  appId: "TU_APP_ID_AQUI",
  //measurementId: "TU_MEASUREMENT_ID_AQUI", // Opcional
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
//const analytics = getAnalytics(app);
export const db = getFirestore(app);
