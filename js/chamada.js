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

    const colete = document.getElementById("colete").value
    .trim();

    const q = query(
        collection(db, "alunos"),
        where("colete", "==", colete)
    );

    const querySnapshot = await getDocs(q);

    alunos = [];

    const lista = document.getElementById("lista-chamada");

    lista.innerHTML = "";

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
    });

    esconderLoading();
}

async function salvarChamada() {

    mostrarLoading();

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

    for(let index = 0; index < alunos.length; index++) {

        const aluno = alunos[index];

        await addDoc(collection(db, "chamadas"), {

            nome: aluno.nome,
            turma: aluno.turma,
            colete: aluno.colete,
            status: document.getElementById(
                `status-${index}`
            ).value,

            data: dataFormatada
        });
    }

    alert("Chamada salva com sucesso");

    esconderLoading();
}

window.carregarAlunos = carregarAlunos;

window.salvarChamada = salvarChamada;
