import {
    db
} from "./firebase.js";

import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

async function carregarHistorico() {

    if(window.mostrarLoading) {

        window.mostrarLoading();
    }

    const colete = localStorage.getItem(
        "historicoColete"
    )
    .trim()
    .toLowerCase();

    const dataInicialString = localStorage.getItem(
        "historicoDataInicial"
    );

    const dataFinalString = localStorage.getItem(
        "historicoDataFinal"
    );

    const dataInicial = new Date(
        dataInicialString
    );

    const dataFinal = new Date(
        dataFinalString
    );

    const querySnapshot = await getDocs(
        collection(db, "chamadas")
    );

    const resultado = document.getElementById(
        "resultado"
    );

    resultado.innerHTML = "";

    const diferencaDias = Math.floor(
        (dataFinal - dataInicial)
        /
        (1000 * 60 * 60 * 24)
    );

    const faltasPorAluno = {};

    querySnapshot.forEach((doc) => {

        const chamada = doc.data();

        const coleteSalvo =
            chamada.colete
            .trim()
            .toLowerCase();

        if(coleteSalvo !== colete) {

            return;
        }

        const dataChamada =
            chamada.data.toDate();

        const ano =
            dataChamada.getFullYear();

        const mes =
            String(
                dataChamada.getMonth() + 1
            ).padStart(2, "0");

        const dia =
            String(
                dataChamada.getDate()
            ).padStart(2, "0");

        const chamadaFormatada =
            `${ano}-${mes}-${dia}`;

        if(
            chamadaFormatada >= dataInicialString
            &&
            chamadaFormatada <= dataFinalString
        ) {

            if(diferencaDias === 0) {

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

    if(diferencaDias >= 1) {

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

    if(window.esconderLoading) {

        window.esconderLoading();
    }
}

carregarHistorico();
