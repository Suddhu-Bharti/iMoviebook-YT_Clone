import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from "firebase/auth"

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDtI5tI75Of95FqnRf02DeQx1n_HBTDb6s",
  authDomain: "cloney-25c71.firebaseapp.com",
  projectId: "cloney-25c71",
  storageBucket: "cloney-25c71.appspot.com",
  messagingSenderId: "1077893014826",
  appId: "1:1077893014826:web:79ba87237bc3777697aa53"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const provider = new GoogleAuthProvider();

export default app;