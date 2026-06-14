import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyC3os-bEYyLgnwdWBEU_p_nN7ylRR1sWeM",
  authDomain: "healthtech-2828f.firebaseapp.com",
  projectId: "healthtech-2828f",
  storageBucket: "healthtech-2828f.firebasestorage.app",
  messagingSenderId: "876699029970",
  appId: "1:876699029970:web:d8db5637c3d55c7241b80b",
  measurementId: "G-4QKPTEZ4TX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)

export default auth