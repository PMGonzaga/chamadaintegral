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

function selecionarColete(colete) {

    document.getElementById("colete").value =
        colete;

    document.querySelectorAll(".btn-colete")
    .forEach((botao) => {

        botao.classList.remove(
            "colete-selecionado"
        );
    });

    if(colete === "Amarelo") {

        document.querySelector(".btn-amarelo")
        .classList.add("colete-selecionado");
    }

    if(colete === "Azul") {

        document.querySelector(".btn-azul")
        .classList.add("colete-selecionado");
    }

    if(colete === "Verde") {

        document.querySelector(".btn-verde")
        .classList.add("colete-selecionado");
    }
}

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

        document.querySelectorAll(".btn-colete")
        .forEach((botao) => {

            botao.classList.remove(
                "colete-selecionado"
            );
        });

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

        const listaAmarelo = document.getElementById(
            "lista-amarelo"
        );

        const listaAzul = document.getElementById(
            "lista-azul"
        );

        const listaVerde = document.getElementById(
            "lista-verde"
        );

        listaAmarelo.innerHTML = "";

        listaAzul.innerHTML = "";

        listaVerde.innerHTML = "";

        const alunos = [];

        querySnapshot.forEach((documento) => {

            alunos.push({
                id: documento.id,
                ...documento.data()
            });
        });

        alunos.sort((a, b) => {

            return a.nome.localeCompare(
                b.nome,
                "pt-BR",
                {
                    sensitivity: "base"
                }
            );
        });

        alunos.forEach((aluno) => {

            const htmlAluno = `
                <div class="aluno">

                    <span>
                        ${aluno.nome}
                        -
                        ${aluno.turma}
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

            if(aluno.colete === "Amarelo") {

                listaAmarelo.innerHTML += htmlAluno;
            }

            if(aluno.colete === "Azul") {

                listaAzul.innerHTML += htmlAluno;
            }

            if(aluno.colete === "Verde") {

                listaVerde.innerHTML += htmlAluno;
            }
        });

    } finally {

        esconderLoading();
    }
}

listarAlunos();

window.cadastrarAluno = cadastrarAluno;

window.deletarAluno = deletarAluno;

window.editarAluno = editarAluno;

window.selecionarColete = selecionarColete;
