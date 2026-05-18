import {
    db
} from "./firebase.js";

import {
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc,
    updateDoc
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

        const querySnapshot = await getDocs(
            collection(db, "alunos")
        );

        let alunoExiste = false;

        querySnapshot.forEach((documento) => {

            const aluno = documento.data();

            if(
                aluno.nome.toLowerCase() === nome.toLowerCase()
            ) {

                alunoExiste = true;
            }
        });

        if(alunoExiste) {

            alert("Este aluno já está cadastrado");

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

async function editarAluno(id, nomeAtual, turmaAtual, coleteAtual) {

    const novoNome = prompt(
        "Editar nome:",
        nomeAtual
    );

    if(!novoNome) {
        return;
    }

    const novaTurma = prompt(
        "Editar turma:",
        turmaAtual
    );

    if(!novaTurma) {
        return;
    }

    const novoColete = prompt(
        "Editar colete:",
        coleteAtual
    );

    if(!novoColete) {
        return;
    }

    mostrarLoading();

    try {

        await updateDoc(
            doc(db, "alunos", id),
            {

                nome: novoNome.trim(),
                turma: novaTurma.trim(),
                colete: novoColete.trim()
            }
        );

        alert("Aluno atualizado");

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

        const alunos = [];

        querySnapshot.forEach((documento) => {

            alunos.push({
                id: documento.id,
                ...documento.data()
            });
        });

        alunos.sort((a, b) => {

            const coleteComparacao =
                a.colete.localeCompare(
                    b.colete,
                    "pt-BR",
                    {
                        sensitivity: "base"
                    }
                );

            if(coleteComparacao !== 0) {

                return coleteComparacao;
            }

            return a.nome.localeCompare(
                b.nome,
                "pt-BR",
                {
                    sensitivity: "base"
                }
            );
        });

        alunos.forEach((aluno) => {

            lista.innerHTML += `
                <div class="aluno">

                    <span>
                        ${aluno.nome}
                        -
                        ${aluno.turma}
                        -
                        Colete ${aluno.colete}
                    </span>

                    <div class="acoes">

                        <button
                            class="btn-editar"
                            onclick="editarAluno(
                                '${aluno.id}',
                                '${aluno.nome}',
                                '${aluno.turma}',
                                '${aluno.colete}'
                            )"
                        >
                            ✏️
                        </button>

                        <button
                            class="btn-deletar"
                            onclick="deletarAluno('${aluno.id}')"
                        >
                            🗑
                        </button>

                    </div>

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

window.editarAluno = editarAluno;
