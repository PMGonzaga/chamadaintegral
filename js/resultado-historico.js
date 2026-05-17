import {
    db
} from "./firebase.js";

import {
    collection,
    getDocs,
    query,
    where
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

async function carregarHistorico() {

    mostrarLoading();

    try {

        const colete = localStorage.getItem(
            "historicoColete"
        ).trim();

        const dataInicial = localStorage.getItem(
            "historicoDataInicial"
        );

        const dataFinal = localStorage.getItem(
            "historicoDataFinal"
        );

        const resultado = document.getElementById(
            "resultado"
        );

        resultado.innerHTML = "";

        const q = query(
            collection(db, "chamadas"),
            where("colete", "==", colete)
        );

        const querySnapshot = await getDocs(q);

        const faltasPorAluno = {};

        const pesquisaIndividual =
            dataInicial === dataFinal;

        querySnapshot.forEach((doc) => {

            const chamada = doc.data();

            if(
                chamada.dataFormatada >= dataInicial
                &&
                chamada.dataFormatada <= dataFinal
            ) {

                if(pesquisaIndividual) {

                    resultado.innerHTML += `
                        <div class="aluno">

                            <div>

                                <strong>
                                    ${chamada.nome}
                                </strong>

                                <br>

                                <small>
                                    ${chamada.turma}
                                </small>

                            </div>

                            <span>
                                ${chamada.status}
                            </span>

                        </div>
                    `;

                } else {

                    if(
                        !faltasPorAluno[
                            chamada.nome
                        ]
                    ) {

                        faltasPorAluno[
                            chamada.nome
                        ] = 0;
                    }

                    if(
                        chamada.status === "Falta"
                    ) {

                        faltasPorAluno[
                            chamada.nome
                        ]++;
                    }
                }
            }
        });

        if(!pesquisaIndividual) {

            for(
                const nome in faltasPorAluno
            ) {

                resultado.innerHTML += `
                    <div class="aluno">

                        <span>
                            ${nome}
                        </span>

                        <span>
                            ${faltasPorAluno[nome]} faltas
                        </span>

                    </div>
                `;
            }
        }

        if(resultado.innerHTML === "") {

            resultado.innerHTML = `
                <div class="aluno">

                    <span>
                        Nenhum resultado encontrado
                    </span>

                </div>
            `;
        }

    } finally {

        esconderLoading();
    }
}

carregarHistorico();
