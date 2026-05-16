import {
    db
} from "./firebase.js";

import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

async function carregarHistorico() {

    mostrarLoading();

    const colete = localStorage.getItem(
        "historicoColete"
    ).trim().toLowerCase();

    const dataInicialString = localStorage.getItem(
        "historicoDataInicial"
    );

    const dataFinalString = localStorage.getItem(
        "historicoDataFinal"
    );

    const resultado = document.getElementById(
        "resultado"
    );

    resultado.innerHTML = "";

    const pesquisaUnica =
        dataInicialString === dataFinalString;

    const querySnapshot = await getDocs(
        collection(db, "chamadas")
    );

    const faltasPorAluno = {};

    querySnapshot.forEach((doc) => {

        const chamada = doc.data();

        const coleteFirebase =
            chamada.colete
            .trim()
            .toLowerCase();

        if(coleteFirebase !== colete) {
            return;
        }

        const dataChamada =
            chamada.dataFormatada;

        if(
            dataChamada >= dataInicialString
            &&
            dataChamada <= dataFinalString
        ) {

            if(pesquisaUnica) {

                resultado.innerHTML += `
                    <div class="aluno">

                        <span>
                            ${chamada.nome}
                        </span>

                        <span>
                            ${chamada.status}
                        </span>

                    </div>
                `;

            } else {

                if(!faltasPorAluno[chamada.nome]) {

                    faltasPorAluno[chamada.nome] = 0;
                }

                if(chamada.status === "Falta") {

                    faltasPorAluno[chamada.nome]++;
                }
            }
        }
    });

    if(!pesquisaUnica) {

        for(const nome in faltasPorAluno) {

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

    esconderLoading();
}

carregarHistorico();
