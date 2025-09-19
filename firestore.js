// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-analytics.js";
import { updateProfile, getAuth } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";
import { serverTimestamp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";
import { apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId, measurementId } from "./env.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: apiKey,
    authDomain: authDomain,
    projectId: projectId,
    storageBucket: storageBucket,
    messagingSenderId: messagingSenderId,
    appId: appId,
    measurementId: measurementId
};

// console.log(apiKey,"\n", authDomain,"\n", projectId,"\n", storageBucket,"\n", messagingSenderId,"\n", appId,"\n", measurementId);

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export const auth = getAuth(app);
console.log(db);

export const addContact = async (name, email, sub, message) => {
    try {
        console.log("doc creation started");
        const docRef = await addDoc(collection(db, "contacts"), {
            name: name,
            email: email,
            subject: sub,
            message: message,
            timestamp: serverTimestamp()
        });
        console.log("doc creation finished");
        if (docRef) {
            return docRef;
            console.log("file saved");
        }
    } catch (error) {
        // alert("Error! Please try again");
        console.log("alert");
    }
    console("returning null");
    return null;
}

export default { addContact, auth };