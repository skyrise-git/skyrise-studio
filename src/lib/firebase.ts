import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAqGsPwylpb0a4I9w7yPkUUrT3J0jEFFQM",
  authDomain: "studio-8006430625-95044.firebaseapp.com",
  databaseURL: "https://studio-8006430625-95044-default-rtdb.firebaseio.com",
  projectId: "studio-8006430625-95044",
  storageBucket: "studio-8006430625-95044.firebasestorage.app",
  messagingSenderId: "116809455060",
  appId: "1:116809455060:web:100483fe89497243bd3241"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getDatabase(app);
const storage = getStorage(app);

export { app, auth, db, storage };
