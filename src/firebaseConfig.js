import { initializeApp } from "firebase/app";

import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore/lite";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDVe39uXI5P5BrxVpzsVA9REgiowtyVKvo",
  authDomain: "vue-3-nt2-2024-tp.firebaseapp.com",
  projectId: "vue-3-nt2-2024-tp",
  storageBucket: "vue-3-nt2-2024-tp.appspot.com",
  messagingSenderId: "585220558332",
  appId: "1:585220558332:web:8c805a6797c17258233679",
};

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();
const storage = getStorage(firebaseApp);

export { auth, db, storage };
