// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDr4oMEdJpszRTaUQzXDXV0T-7CzIJ2UiM",
  authDomain: "netflix-gpt-3e7f9.firebaseapp.com",
  projectId: "netflix-gpt-3e7f9",
  storageBucket: "netflix-gpt-3e7f9.appspot.com",
  messagingSenderId: "501618326778",
  appId: "1:501618326778:web:8a01ca2bc4c67fd2e0dd43",
  measurementId: "G-TCS91F1PCN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth();