import {
    db
} from "./firebase.js";

import {
    collection,
    addDoc,
    getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

async function cadastrarAluno() {

    mostrarLoading();

    try {

        const nome = document.getElementById("nome").value;

        const turma = document.getElementById("turma").value;

        const colete = document.getElementById("colete").value;

        await addDoc(collection(db, "alunos"), {

            nome,
            turma,
            colete,
            criadoEm: new Date()
        });

        alert("Aluno cadastrado");

        listarAlunos();

    } finally {

        esconderLoading();
    }
}

async function listarAlunos() {

    mostrarLoading();

    try {

        const querySnapshot = await getDocs(
            collection(db, "alunos")
        );

        const lista = document.getElementById("lista-alunos");

        lista.innerHTML = "";

        querySnapshot.forEach((doc) => {

            const aluno = doc.data();

            lista.innerHTML += `
                <div class="aluno">
                    <span>
                        ${aluno.nome} - ${aluno.colete}
                    </span>
                </div>
            `;
        });

    } finally {

        esconderLoading();
    }
}

listarAlunos();

window.cadastrarAluno = cadastrarAluno;
