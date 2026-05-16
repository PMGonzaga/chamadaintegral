import {
    auth
} from "./firebase.js";

import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut
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

        localStorage.setItem("logado", "true");

        window.location.href = "dashboard.html";

    } catch(error) {

        alert("Login inválido");
    }
}

async function cadastrar() {

    const email = document.getElementById("email").value;

    const senha = document.getElementById("senha").value;

    try {

        await createUserWithEmailAndPassword(
            auth,
            email,
            senha
        );

        alert("Conta criada com sucesso");

        window.location.href = "index.html";

    } catch(error) {

        alert(error.message);
    }
}

async function logout() {

    await signOut(auth);

    localStorage.removeItem("logado");

    window.location.href = "index.html";
}

window.login = login;

window.cadastrar = cadastrar;

window.logout = logout;
