import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from 'firebase/storage';  // Firebase Storage をインポート

const firebaseConfig = {
  apiKey: "AIzaSyBRml9jmXX1Wr2-JQeaKQI-DFtrYynqSZQ",
  authDomain: "react-issue.firebaseapp.com",
  projectId: "react-issue",
  storageBucket: "react-issue.appspot.com",
  messagingSenderId: "171319203541",
  appId: "1:171319203541:web:82aed1618d5e8d5ced345c"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);
const storage = getStorage(app);  // Storage インスタンスを作成

export { auth, provider, db, storage };