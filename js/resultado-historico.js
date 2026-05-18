import {
    db
} from "./firebase.js";

import {
    collection,
    getDocs,
    updateDoc,
    doc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

let modoEdicao = false;

let alterouChamada = false;

let chamadasCarregadas = [];

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

        chamadasCarregadas = [];

        const querySnapshot = await getDocs(
            collection(db, "chamadas")
        );

        const faltasPorAluno = {};

        const pesquisaIndividual =
            dataInicial === dataFinal;

        querySnapshot.forEach((documento) => {

            const chamada = documento.data();

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

                chamadasCarregadas.push({
                    id: documento.id,
                    ...chamada
                });

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

                            <span
                                class="status-chamada"
                                id="status-${documento.id}"
                            >
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

function ativarEdicao() {

    if(modoEdicao) {
        return;
    }

    modoEdicao = true;

    const resultado = document.getElementById(
        "resultado"
    );

    chamadasCarregadas.forEach((chamada) => {

        const elemento = document.getElementById(
            `status-${chamada.id}`
        );

        if(elemento) {

            elemento.outerHTML = `
                <select
                    id="status-${chamada.id}"
                    onchange="detectarAlteracao()"
                >

                    <option
                        value="Presente"
                        ${
                            chamada.status === "Presente"
                            ? "selected"
                            : ""
                        }
                    >
                        Presente
                    </option>

                    <option
                        value="Falta"
                        ${
                            chamada.status === "Falta"
                            ? "selected"
                            : ""
                        }
                    >
                        Falta
                    </option>

                </select>
            `;
        }
    });
}

function detectarAlteracao() {

    alterouChamada = true;

    document.getElementById(
        "btn-salvar-chamada"
    ).style.display = "block";
}

async function salvarEdicao() {

    if(!alterouChamada) {
        return;
    }

    mostrarLoading();

    try {

        for(
            let index = 0;
            index < chamadasCarregadas.length;
            index++
        ) {

            const chamada =
                chamadasCarregadas[index];

            const novoStatus =
                document.getElementById(
                    `status-${chamada.id}`
                ).value;

            if(
                novoStatus !== chamada.status
            ) {

                await updateDoc(
                    doc(
                        db,
                        "chamadas",
                        chamada.id
                    ),
                    {

                        status: novoStatus
                    }
                );
            }
        }

        alert(
            "Chamada atualizada com sucesso"
        );

        modoEdicao = false;

        alterouChamada = false;

        document.getElementById(
            "btn-salvar-chamada"
        ).style.display = "none";

        carregarHistorico();

    } finally {

        esconderLoading();
    }
}

carregarHistorico();

window.ativarEdicao = ativarEdicao;

window.salvarEdicao = salvarEdicao;

window.detectarAlteracao = detectarAlteracao;
