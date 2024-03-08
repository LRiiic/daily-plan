// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAaxUOSLvZKEdBKgG-G5EiyZvGRRUa63Tc",
  authDomain: "daily-plan-pro.firebaseapp.com",
  projectId: "daily-plan-pro",
  storageBucket: "daily-plan-pro.appspot.com",
  messagingSenderId: "825838108191",
  appId: "1:825838108191:web:d48fa33104ad4315cddf2a",
  measurementId: "G-NPW35N040Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);