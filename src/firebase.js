import { initializeApp } from "firebase/app";
import 'dotenv/config';

console.log(process.env.API_KEY);

export const firebaseConfig = {
    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
    messagingSenderId: process.env.MESS_SENDER_ID,
    appId: process.env.APP_ID,
    measurementId: process.env.MEASUREMENT_ID
}

export const firebaseApp = initializeApp(firebaseConfig);