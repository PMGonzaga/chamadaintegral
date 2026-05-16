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

    const colete = localStorage.getItem(
        "historicoColete"
    );

    const dataInicial = new Date(
        localStorage.getItem(
            "historicoDataInicial"
        )
    );

    const dataFinal = new Date(
        localStorage.getItem(
            "historicoDataFinal"
        )
    );

    dataFinal.setHours(
        23,
        59,
        59,
        999
    );

    const q = query(
        collection(db, "chamadas"),
        where("colete", "==", colete)
    );

    const querySnapshot = await getDocs(q);

    const resultado = document.getElementById(
        "resultado"
    );

    resultado.innerHTML = "";

    const diferencaDias = Math.ceil(
        (dataFinal - dataInicial)
        /
        (1000 * 60 * 60 * 24)
    );

    const faltasPorAluno = {};

    querySnapshot.forEach((doc) => {

        const chamada = doc.data();

        const dataChamada =
            chamada.data.toDate();

        if(
            dataChamada >= dataInicial
            &&
            dataChamada <= dataFinal
        ) {

            if(diferencaDias <= 1) {

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

    if(diferencaDias > 1) {

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
}

carregarHistorico();
