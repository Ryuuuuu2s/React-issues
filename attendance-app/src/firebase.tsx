import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAEM6Mb209WQsYa_PFiS9jSkROuMgQutHM",
  authDomain: "attendance-app-6c946.firebaseapp.com",
  projectId: "attendance-app-6c946",
  storageBucket: "attendance-app-6c946.appspot.com",
  messagingSenderId: "721109455888",
  appId: "1:721109455888:web:0029c1955b343d333ee695",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

export { auth, provider, db };
