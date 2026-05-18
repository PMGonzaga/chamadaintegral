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

async function carregarAlunos() {

    mostrarLoading();

    try {

        const colete = document.getElementById(
            "colete"
        ).value.trim();

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

            alunos.push(doc.data());
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

                    <div>

                        <strong>
                            ${aluno.nome}
                        </strong>

                        <br>

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
