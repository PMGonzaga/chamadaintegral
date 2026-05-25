import {
    db
} from "./firebase.js";

import {
    collection,
    getDocs,
    query,
    where,
    addDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

let alunos = [];

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

async function carregarAlunos() {

    mostrarLoading();

    try {

        const colete = document.getElementById(
            "colete"
        ).value.trim();

        if(!colete) {

            alert(
                "Selecione um colete"
            );

            return;
        }

        document.getElementById(
            "titulo-colete"
        ).innerHTML =
            `Alunos do Colete ${colete}`;

        const q = query(
            collection(db, "alunos"),
            where("colete", "==", colete)
        );

        const querySnapshot = await getDocs(q);

        alunos = [];

        const listaColete = document.getElementById(
            "lista-alunos-colete"
        );

        listaColete.innerHTML = "";

        querySnapshot.forEach((doc) => {

            alunos.push({
                id: doc.id,
                ...doc.data()
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

        alunos.forEach((aluno, index) => {

            listaColete.innerHTML += `
                <div class="aluno">

                    <div class="aluno-info">

                        <div class="linha-nome-tags">

                            <strong class="nome-aluno">
                                ${aluno.nome}
                            </strong>

                            <div class="aluno-tags-chamada">

                                ${aluno.musica ? `
                                    <span class="tag-badge tag-musica">
                                        🎵
                                    </span>
                                ` : ''}

                                ${aluno.luta ? `
                                    <span class="tag-badge tag-luta">
                                        🥊
                                    </span>
                                ` : ''}

                                ${aluno.atletismo ? `
                                    <span class="tag-badge tag-atletismo">
                                        🏃
                                    </span>
                                ` : ''}

                            </div>

                        </div>

                        <small>
                            ${aluno.turma}
                        </small>

                    </div>

                    <select id="status-${index}">

                        <option value="Presente">
                            Presente
                        </option>

                        <option value="Falta">
                            Falta
                        </option>

                    </select>

                </div>
            `;
        });

        if(alunos.length === 0) {

            listaColete.innerHTML = `
                <div class="aluno">

                    <span>
                        Nenhum aluno encontrado
                    </span>

                </div>
            `;

            document.getElementById(
                "btn-salvar-chamada-lista"
            ).style.display = "none";

        } else {

            document.getElementById(
                "btn-salvar-chamada-lista"
            ).style.display = "block";
        }

    } finally {

        esconderLoading();
    }
}

async function salvarChamada() {

    mostrarLoading();

    try {

        const hoje = new Date();

        const dataFormatada =
            hoje.getFullYear()
            + "-"
            + String(
                hoje.getMonth() + 1
            ).padStart(2, "0")
            + "-"
            + String(
                hoje.getDate()
            ).padStart(2, "0");

        const colete = document.getElementById(
            "colete"
        ).value.trim();

        if(!colete) {

            alert(
                "Selecione um colete"
            );

            return;
        }

        const verificarQuery = query(
            collection(db, "chamadas"),
            where("colete", "==", colete),
            where("dataFormatada", "==", dataFormatada)
        );

        const chamadaExistente =
            await getDocs(verificarQuery);

        if(!chamadaExistente.empty) {

            alert(
                "Este colete já teve chamada realizada hoje."
            );

            return;
        }

        for(
            let index = 0;
            index < alunos.length;
            index++
        ) {

            const aluno = alunos[index];

            await addDoc(
                collection(db, "chamadas"),
                {

                    nome: aluno.nome,

                    turma: aluno.turma,

                    colete: aluno.colete,

                    musica: aluno.musica || false,

                    luta: aluno.luta || false,

                    atletismo: aluno.atletismo || false,

                    status: document.getElementById(
                        `status-${index}`
                    ).value,

                    dataFormatada
                }
            );
        }

        alert(
            "Chamada salva com sucesso"
        );

    } finally {

        esconderLoading();
    }
}

window.carregarAlunos = carregarAlunos;

window.salvarChamada = salvarChamada;

window.selecionarColete = selecionarColete;
