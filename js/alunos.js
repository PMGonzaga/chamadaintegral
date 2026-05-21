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

            alert(
                "Preencha todos os campos e selecione um colete"
            );

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

            musica: false,
            luta: false,
            atletismo: false,

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

async function alternarTag(id, tagAtual, campo) {

    mostrarLoading();

    try {

        await updateDoc(
            doc(db, "alunos", id),
            {
                [campo]: !tagAtual
            }
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

        const chamadasSnapshot = await getDocs(
            collection(db, "chamadas")
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

        const mesAtual =
            new Date().getMonth();

        const anoAtual =
            new Date().getFullYear();

        const alunosComPresenca = [];

        chamadasSnapshot.forEach((documento) => {

            const chamada = documento.data();

            const data = new Date(
                chamada.dataFormatada
            );

            const mesChamada =
                data.getMonth();

            const anoChamada =
                data.getFullYear();

            if(
                chamada.status === "Presente"
                &&
                mesChamada === mesAtual
                &&
                anoChamada === anoAtual
            ) {

                alunosComPresenca.push(
                    chamada.nome.toLowerCase()
                );
            }
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

        let quantidadeAmarelo = 0;
        let quantidadeAzul = 0;
        let quantidadeVerde = 0;

        alunos.forEach((aluno) => {

            const semPresenca =
                !alunosComPresenca.includes(
                    aluno.nome.toLowerCase()
                );

            const classeSemPresenca =
                semPresenca
                ? "aluno-sem-presenca"
                : "";

            const htmlAluno = `
                <div class="aluno ${classeSemPresenca}">

                    <div class="aluno-info">

                        <span>
                            ${aluno.nome}
                            -
                            ${aluno.turma}
                        </span>

                        <div class="tags-aluno">

                            <button
                                class="tag-btn ${aluno.musica ? 'tag-ativa' : ''}"
                                onclick="alternarTag('${aluno.id}', ${aluno.musica || false}, 'musica')"
                                type="button"
                            >
                                🎵
                            </button>

                            <button
                                class="tag-btn ${aluno.luta ? 'tag-ativa' : ''}"
                                onclick="alternarTag('${aluno.id}', ${aluno.luta || false}, 'luta')"
                                type="button"
                            >
                                🥊
                            </button>

                            <button
                                class="tag-btn ${aluno.atletismo ? 'tag-ativa' : ''}"
                                onclick="alternarTag('${aluno.id}', ${aluno.atletismo || false}, 'atletismo')"
                                type="button"
                            >
                                🏃
                            </button>

                        </div>

                    </div>

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

                quantidadeAmarelo++;

                listaAmarelo.innerHTML += htmlAluno;
            }

            if(aluno.colete === "Azul") {

                quantidadeAzul++;

                listaAzul.innerHTML += htmlAluno;
            }

            if(aluno.colete === "Verde") {

                quantidadeVerde++;

                listaVerde.innerHTML += htmlAluno;
            }
        });

        document.getElementById("titulo-amarelo")
        .innerText =
            `Lista do Colete Amarelo (${quantidadeAmarelo})`;

        document.getElementById("titulo-azul")
        .innerText =
            `Lista do Colete Azul (${quantidadeAzul})`;

        document.getElementById("titulo-verde")
        .innerText =
            `Lista do Colete Verde (${quantidadeVerde})`;

    } finally {

        esconderLoading();
    }
}

listarAlunos();

window.cadastrarAluno = cadastrarAluno;

window.deletarAluno = deletarAluno;

window.editarAluno = editarAluno;

window.selecionarColete = selecionarColete;

window.alternarTag = alternarTag;
