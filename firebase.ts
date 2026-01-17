import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDWBrTSzHOSjOKcP4TY32GmtLGHf2c9RGM",
  authDomain: "nainagarh-db.firebaseapp.com",
  projectId: "nainagarh-db",
  storageBucket: "nainagarh-db.firebasestorage.app",
  messagingSenderId: "144612917603",
  appId: "1:144612917603:web:806910d2103ec2fdd1356",
  measurementId: "G-G84PZGLZNN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export { db, analytics };