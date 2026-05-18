import {
    db
} from "./firebase.js";

import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

async function carregarHistorico() {

    mostrarLoading();

    try {

        const colete = localStorage.getItem(
            "historicoColete"
        )
        .trim();

        const dataInicial = localStorage.getItem(
            "historicoDataInicial"
        );

        const dataFinal = localStorage.getItem(
            "historicoDataFinal"
        );

        const titulo = document.getElementById(
            "titulo-resultado"
        );

        titulo.innerHTML =
            `Resultado Colete ${colete} - ${dataInicial}`;

        const resultado = document.getElementById(
            "resultado"
        );

        resultado.innerHTML = "";

        const querySnapshot = await getDocs(
            collection(db, "chamadas")
        );

        const faltasPorAluno = {};

        const pesquisaIndividual =
            dataInicial === dataFinal;

        querySnapshot.forEach((doc) => {

            const chamada = doc.data();

            const coleteSalvo =
                chamada.colete
                .trim();

            if(coleteSalvo !== colete) {
                return;
            }

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
