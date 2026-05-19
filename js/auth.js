import {
    auth,
    db
} from "./firebase.js";

import {
    collection,
    addDoc,
    getDocs,
    query,
    where
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

async function login() {

    mostrarLoading();

    const email = document.getElementById("email").value
    .trim();

    const senha = document.getElementById("senha").value
    .trim();

    if(!email || !senha) {

        alert("Preencha todos os campos");

        esconderLoading();

        return;
    }

    try {

        await signInWithEmailAndPassword(
            auth,
            email,
            senha
        );

        const q = query(
            collection(db, "professores"),
            where("email", "==", email)
        );

        const querySnapshot = await getDocs(q);

        if(querySnapshot.empty) {

            await signOut(auth);

            alert(
                "Professor não encontrado"
            );

            esconderLoading();

            return;
        }

        let aprovado = false;

        let nomeProfessor = "";

        querySnapshot.forEach((doc) => {

            const professor = doc.data();

            aprovado = professor.aprovado;

            nomeProfessor = professor.nome;
        });

        if(!aprovado) {

            await signOut(auth);

            alert(
                "Sua conta ainda não foi aprovada"
            );

            esconderLoading();

            return;
        }

        localStorage.setItem(
            "logado",
            "true"
        );

        localStorage.setItem(
            "nomeProfessor",
            nomeProfessor
        );

        window.location.href = "dashboard.html";

    } catch(error) {

        alert("Login inválido");

    } finally {

        esconderLoading();
    }
}

async function cadastrar() {

    mostrarLoading();

    const nome = document.getElementById("nome").value
    .trim();

    const email = document.getElementById("email").value
    .trim();

    const senha = document.getElementById("senha").value
    .trim();

    if(!nome || !email || !senha) {

        alert("Preencha todos os campos");

        esconderLoading();

        return;
    }

    try {

        await createUserWithEmailAndPassword(
            auth,
            email,
            senha
        );

        await addDoc(collection(db, "professores"), {

            nome,
            email,

            aprovado: false,

            criadoEm: new Date()
        });

        alert(
            "Conta criada com sucesso. Aguarde aprovação."
        );

        await signOut(auth);

        window.location.href = "index.html";

    } catch(error) {

        alert(error.message);

    } finally {

        esconderLoading();
    }
}

async function redefinirSenha() {

    const email = document.getElementById("email").value
    .trim();

    if(!email) {

        alert("Digite seu email");

        return;
    }

    mostrarLoading();

    try {

        await sendPasswordResetEmail(
            auth,
            email
        );

        alert(
            "Email de redefinição enviado"
        );

    } catch(error) {

        alert(
            "Erro ao enviar email"
        );

    } finally {

        esconderLoading();
    }
}

async function logout() {

    mostrarLoading();

    try {

        await signOut(auth);

        localStorage.removeItem("logado");

        localStorage.removeItem("nomeProfessor");

        window.location.href = "index.html";

    } finally {

        esconderLoading();
    }
}

window.login = login;

window.cadastrar = cadastrar;

window.logout = logout;

window.redefinirSenha = redefinirSenha;
