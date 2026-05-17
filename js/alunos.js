import {
    db
} from "./firebase.js";

import {
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

async function cadastrarAluno() {

    mostrarLoading();

    try {

        const nome = document.getElementById("nome").value
        .trim();

        const turma = document.getElementById("turma").value
        .trim();

        const colete = document.getElementById("colete").value
        .trim();

        if(!nome || !turma || !colete) {

            alert("Preencha todos os campos");

            return;
        }

        await addDoc(collection(db, "alunos"), {

            nome,
            turma,
            colete,
            criadoEm: new Date()
        });

        alert("Aluno cadastrado");

        document.getElementById("nome").value = "";

        document.getElementById("turma").value = "";

        document.getElementById("colete").value = "";

        listarAlunos();

    } finally {

        esconderLoading();
    }
}

async function deletarAluno(id) {

    const confirmar = confirm(
        "Deseja realmente deletar este aluno?"
    );

    if(!confirmar) {
        return;
    }

    mostrarLoading();

    try {

        await deleteDoc(
            doc(db, "alunos", id)
        );

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

        const lista = document.getElementById(
            "lista-alunos"
        );

        lista.innerHTML = "";

        querySnapshot.forEach((documento) => {

            const aluno = documento.data();

            lista.innerHTML += `
                <div class="aluno">

                    <span>
                        ${aluno.nome}
                        -
                        ${aluno.turma}
                        -
                        Colete ${aluno.colete}
                    </span>

                    <button
                        class="btn-deletar"
                        onclick="deletarAluno('${documento.id}')"
                    >
                        🗑
                    </button>

                </div>
            `;
        });

    } finally {

        esconderLoading();
    }
}

listarAlunos();

window.cadastrarAluno = cadastrarAluno;

window.deletarAluno = deletarAluno;
