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

        const coletePesquisa = localStorage.getItem(
            "historicoColete"
        ).trim().toLowerCase();

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

            if(coleteFirebase !== coletePesquisa) {
                return;
            }

            let dataObj;

            if(
                chamada.data
                &&
                typeof chamada.data.toDate === "function"
            ) {

                dataObj = chamada.data.toDate();

            } else {

                dataObj = new Date(chamada.data);
            }

            const ano =
                dataObj.getFullYear();

            const mes =
                String(
                    dataObj.getMonth() + 1
                ).padStart(2, "0");

            const dia =
                String(
                    dataObj.getDate()
                ).padStart(2, "0");

            const dataRegistro =
                `${ano}-${mes}-${dia}`;

            if(
                dataRegistro >= dataInicial
                &&
                dataRegistro <= dataFinal
            ) {

                if(dataInicial === dataFinal) {

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
                        chamada.status === "Falta"
                    ) {

                        faltasPorAluno[
                            chamada.nome
                        ]++;
                    }
                }
            }
        });

        if(dataInicial !== dataFinal) {

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
