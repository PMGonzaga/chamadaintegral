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

        const lista = document.getElementById(
            "lista-chamada"
        );

        const listaColete = document.getElementById(
            "lista-alunos-colete"
        );

        lista.innerHTML = "";

        listaColete.innerHTML = "";

        querySnapshot.forEach((doc) => {

            alunos.push(doc.data());
        });

        alunos.forEach((aluno, index) => {

            lista.innerHTML += `
                <div class="aluno">

                    <span>
                        ${aluno.nome}
                    </span>

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

            listaColete.innerHTML += `
                <div class="aluno">

                    <span>
                        ${aluno.nome}
                        -
                        ${aluno.turma}
                    </span>

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

            esconderLoading();

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

        alert("Chamada salva com sucesso");

    } finally {

        esconderLoading();
    }
}

window.carregarAlunos = carregarAlunos;

window.salvarChamada = salvarChamada;
