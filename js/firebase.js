// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDpkpoabYifjVAqcand-GyHedFymxkt7IQ",
  authDomain: "lista-chamada-escola.firebaseapp.com",
  projectId: "lista-chamada-escola",
  storageBucket: "lista-chamada-escola.firebasestorage.app",
  messagingSenderId: "712228308178",
  appId: "1:712228308178:web:0beb3c9eb6727643dd590b",
  measurementId: "G-0MYRDXM13W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
