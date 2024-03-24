// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB3v1ZXcy_yol_6BINPlDHXX2eJP-a9bEc",
  authDomain: "gym-sample-e8859.firebaseapp.com",
  projectId: "gym-sample-e8859",
  storageBucket: "gym-sample-e8859.appspot.com",
  messagingSenderId: "603237141055",
  appId: "1:603237141055:web:f9d3fa3ad746f12812468a",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
