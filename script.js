const bar = document.querySelector("#bar");
const nav = document.querySelector("#navbar");
const close = document.querySelector("#close")
if (bar) {
    bar.addEventListener("click", () => {
        nav.classList.add('active');
    })
}
if (close) {
    close.addEventListener("click", () => {
        nav.classList.remove('active');
    })
}

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import { updateProfile } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";



const firebaseConfig = {
    apiKey: "AIzaSyDDof0U8L3KYtrohPHS4s2jixJrKu-2RWo",
    authDomain: "cara-8685a.firebaseapp.com",
    projectId: "cara-8685a",
    storageBucket: "cara-8685a.firebasestorage.app",
    messagingSenderId: "105584726686",
    appId: "1:105584726686:web:1f271464b6723499bf618f",
    measurementId: "G-LXXS4BK2BR"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const loginLink = document.querySelector("#login-link");
const logoutLink = document.querySelector("#logout-link");
const userGreeting = document.querySelector("#user-greeting");
const userName = document.querySelector("#user-name");

const closeModel = document.querySelector("#close-modal");
const authModel = document.querySelector("#auth-modal");
const authTitle = document.querySelector("#auth-title");

const authName = document.querySelector("#auth-name");
const authEmail = document.querySelector("#auth-email");
const authPassword = document.querySelector("#auth-password");
const authError = document.querySelector("#auth-error");

const loginBtn = document.querySelector("#login-btn");
const signupBtn = document.querySelector("#signup-btn");
const authToggle = document.querySelector("#auth-toggle");

let mode = "login";

function openModal(openMode = "login") {
    mode = openMode;
    authError.textContent = "";
    authModel.style.display = "flex";
    if (mode === "login") {
        authTitle.textContent = "Login";
        authName.classList.add("hidden");
        signupBtn.classList.add("hidden");
        loginBtn.classList.remove("hidden");
        authToggle.innerHTML = `Don't have an account? <strong>Sign Up</strong>`;
    }
    else {
        authTitle.textContent = "Sign up";
        authName.classList.remove("hidden");
        signupBtn.classList.remove("hidden");
        loginBtn.classList.add("hidden");
        authToggle.innerHTML = `Already have an account? <strong>Login</strong>`;

    }
}

function closeModalAndClear() {
    authModel.style.display = "none";
    authError.textContent = "";
    if (authName) authName.value = "";
    if (authEmail) authEmail.value = "";
    if (authPassword) authPassword.value = "";
}

function showError(msg) {
    authError.textContent = msg;
}

function ValidateFields() {
    const email = authEmail?.value?.trim() || "";
    const password = authPassword?.value?.trim() || "";
    if (!email) {
        showError("Please Enter Email");
        return false;
    }
    if (!password) {
        showError("Please Enter Password");
        return false;
    }
    if (password.length < 6) {
        showError("Password must be at least 6 characters");
        return false;
    }
    return true;

}

if (loginLink) {
    loginLink.addEventListener("click", (e) => {
        e.preventDefault();
        openModal("login");
    })
}
if (closeModel) {
    closeModel.addEventListener("click", () => {
        closeModalAndClear();
    });
}
window.addEventListener("click", (e) => {
    if (e.target === authModel) {
        closeModalAndClear();
    }
})
if (authToggle) {
    authToggle.addEventListener("click", (e) => {
        e.preventDefault();
        openModal(mode === "login" ? "signup" : "login");
    });
}

if (signupBtn) {
    signupBtn.addEventListener("click", async (e) => {
        e.preventDefault();
        authError.textContent = "";
        if (!ValidateFields()) return;
        const name = authName?.value.trim() || "";
        const email = authEmail.value.trim();
        const password = authPassword.value;

        if (!name) {
            showError("Please enter your name");
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(userCredential.user, { displayName: name });

            await signOut(auth)

            closeModalAndClear();

            openModal("login");
        }
        catch (err) {
            console.error(err);
            if (err.code === "auth/email-already-in-use") showError("Email already in use. Try logging in.");
            else if (err.code === "auth/invalid-email") showError("Invalid email address.");
            else if (err.code === "auth/weak-password") showError("Weak password (min 6 chars).");
            else showError(err.message || "Signup failed. Try again.");
        }
    })
}

if (loginBtn) {
    loginBtn.addEventListener("click", async (e) => {
        e.preventDefault();
        authError.textContent = "";
        if (!ValidateFields()) return;

        const email = authEmail.value.trim();
        const password = authPassword.value;

        try {
            await signInWithEmailAndPassword(auth, email, password);
            closeModalAndClear();
            window.location.href = "index.html";
        }
        catch (err) {
            console.error(err);
            if (err.code === "auth/user-not-found") showError("No account found with this email.");
            else if (err.code === "auth/wrong-password") showError("Incorrect password.");
            else showError(err.message || "Login failed. Try again.");
        }

    })
}
if(logoutLink){
    logoutLink.addEventListener("click", async (e)=>{
        e.preventDefault();
        try{
            await signOut(auth);
        }catch (err) {
            console.error("Logout error:", err)
        }

    });
}

onAuthStateChanged(auth , (user)=>{
    if(user){
        // const nameToShow = user.displayName? user.displayName: (user.email || "User");
        let nameToShow = "";

        if (user.displayName){ 
            nameToShow = user.displayName.split(" ")[0];
        }
        else if(user.email){
            nameToShow = user.email.split("@")[0];
        }
        else{
            nameToShow = "User";
        }

        if (userName) {
            userName.textContent = `Hi, ${nameToShow}`;
        }

        if(userGreeting){
            userGreeting.style.display = "inline-block";
        }
        if(loginLink){
            loginLink.style.display = "none";
        }
        if(logoutLink){
            logoutLink.style.display = "inline-block";
        }
        closeModalAndClear();
    }
    else{
         if(userGreeting){
            userGreeting.style.display = "none";
        }
        if(loginLink){
            loginLink.style.display = "inline-block";
        }
        if(logoutLink){
            logoutLink.style.display = "none";
        } 
        
    }
})




































// if (loginLink) {
//     loginLink.addEventListener("click", (e) => {
//         e.preventDefault()
//         authModel.style.display = "flex";
//     });
// }

// closeLink.addEventListener("click", () => {
//     authModel.style.display = "none";
// });

// window.addEventListener("click", (e) => {
//     if (e.target == authModel) {
//         authModel.style.display = "none";
//     }
// });

// // login

// const signup = document.querySelector("#signup-btn");
// signup.addEventListener("click", (e) => {
//     e.preventDefault();
//     //inputs
//     const email = document.querySelector("#auth-email").value;
//     const password = document.querySelector("#auth-password").value;
//     createUserWithEmailAndPassword(auth, email, password)
//         .then((userCredential) => {

//             const user = userCredential.user;
//             alert("Signed up");
//         })
//         .catch((error) => {
//             const errorCode = error.code;
//             const errorMessage = error.message;
//             alert(errorMessage);
//         });

// })







