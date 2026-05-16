import {
    auth
} from "./firebase.js";

import {
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

async function login() {

    const email = document.getElementById("email").value;

    const senha = document.getElementById("senha").value;

    try {

        await signInWithEmailAndPassword(
            auth,
            email,
            senha
        );

        window.location.href = "dashboard.html";

    } catch(error) {

        alert("Email ou senha inválidos");
    }
}

window.login = login;
