import { apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId, measurementId } from "./env.js";
import { addContact, auth } from "./firestore.js";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

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

// form submission 
document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#contactForm");

  if (!form) return;

 const submitBtn = form.querySelector("#btn");

 form.addEventListener("submit", (e)=>{
    e.preventDefault();

    const name = document.querySelector("#name").value.trim();
    const email = document.querySelector("#email").value.trim();
    const subject = document.querySelector("#subject").value.trim();
    const message = document.querySelector("#message").value.trim();

    if (!name || !email || !message) {
      alert(" Please fill all required fields");
      return;
    }

    try{
        console.log("function called");
        addContact(name, email, subject, message);
        alert("message sent");
    }catch(error){
        alert("Error! Please try again");
    }


  })


});













































