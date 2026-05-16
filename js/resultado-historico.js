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

        const dataInicialString = localStorage.getItem(
            "historicoDataInicial"
        );

        const dataFinalString = localStorage.getItem(
            "historicoDataFinal"
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

        const faltasPorAluno = {};

        querySnapshot.forEach((doc) => {

            const chamada = doc.data();

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

            const dataFormatada =
                `${ano}-${mes}-${dia}`;

            if(
                dataFormatada >= dataInicialString
                &&
                dataFormatada <= dataFinalString
            ) {

                if(
                    dataInicialString ===
                    dataFinalString
                ) {

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
                        chamada.status ===
                        "Falta"
                    ) {

                        faltasPorAluno[
                            chamada.nome
                        ]++;
                    }
                }
            }
        });

        if(
            dataInicialString !==
            dataFinalString
        ) {

            for(
                const nome
                in
                faltasPorAluno
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

    } catch(error) {

        console.error(error);

    } finally {

        esconderLoading();
    }
}

carregarHistorico();
