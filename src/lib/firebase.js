import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCLfb9EatETSdq6SH1JHrgr_2bRNqTOwxQ",
  authDomain: "unitrade-bm56sit.firebaseapp.com",
  projectId: "unitrade-bm56sit",
  storageBucket: "unitrade-bm56sit.firebasestorage.app",
  messagingSenderId: "50145602455",
  appId: "1:50145602455:web:5355c1ddb7d4b1996e72d2"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
// export const storage = getStorage(app); <--- DELETED THIS LINE