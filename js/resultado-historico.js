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

        const resultado = document.getElementById(
            "resultado"
        );

        const btnEditar =
            document.getElementById(
                "btn-editar-chamada"
            );

        resultado.innerHTML = "";

        chamadasCarregadas = [];

        const pesquisaIndividual =
            dataInicial === dataFinal;

        if(
            colete !== "Todos"
            &&
            pesquisaIndividual
        ) {

            btnEditar.style.display =
                "block";

        } else {

            btnEditar.style.display =
                "none";
        }

        const querySnapshot = await getDocs(
            collection(db, "chamadas")
        );

        if(colete === "Todos") {

            titulo.innerHTML =
                `Resultado Geral - ${dataInicial}`;

            const estatisticas = {

                Amarelo: {
                    presentes: 0,
                    faltas: 0
                },

                Azul: {
                    presentes: 0,
                    faltas: 0
                },

                Verde: {
                    presentes: 0,
                    faltas: 0
                }
            };

            let totalPresentes = 0;

            let totalFaltas = 0;

            querySnapshot.forEach((documento) => {

                const chamada = documento.data();

                if(
                    chamada.dataFormatada >= dataInicial
                    &&
                    chamada.dataFormatada <= dataFinal
                ) {

                    const coleteAtual =
                        chamada.colete;

                    if(
                        estatisticas[coleteAtual]
                    ) {

                        if(
                            chamada.status === "Presente"
                        ) {

                            estatisticas[
                                coleteAtual
                            ].presentes++;

                            totalPresentes++;

                        } else {

                            estatisticas[
                                coleteAtual
                            ].faltas++;

                            totalFaltas++;
                        }
                    }
                }
            });

            Object.keys(estatisticas)
            .forEach((nomeColete) => {

                resultado.innerHTML += `
                    <div class="aluno">

                        <div>

                            <strong>
                                Colete ${nomeColete}
                            </strong>

                        </div>

                        <div>

                            <span>
                                ${estatisticas[nomeColete].presentes}
                                presentes
                            </span>

                            <br>

                            <span>
                                ${estatisticas[nomeColete].faltas}
                                faltas
                            </span>

                        </div>

                    </div>
                `;
            });

            resultado.innerHTML += `
                <div class="aluno total-geral">

                    <div>

                        <strong>
                            Total Geral
                        </strong>

                    </div>

                    <div>

                        <span>
                            ${totalPresentes}
                            presentes
                        </span>

                        <br>

                        <span>
                            ${totalFaltas}
                            faltas
                        </span>

                    </div>

                </div>
            `;

            esconderLoading();

            return;
        }

        titulo.innerHTML =
            `Resultado Colete ${colete} - ${dataInicial}`;

        const faltasPorAluno = {};

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

                            <div class="aluno-info">

                                <div class="linha-nome-tags">

                                    <strong class="nome-aluno">
                                        ${chamada.nome}
                                    </strong>

                                    <div class="aluno-tags-chamada">

                                        ${chamada.musica ? `
                                            <span class="tag-badge tag-musica">
                                                🎵
                                            </span>
                                        ` : ''}

                                        ${chamada.luta ? `
                                            <span class="tag-badge tag-luta">
                                                🥊
                                            </span>
                                        ` : ''}

                                        ${chamada.atletismo ? `
                                            <span class="tag-badge tag-atletismo">
                                                🏃
                                            </span>
                                        ` : ''}

                                    </div>

                                </div>

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
                        ] = {

                            faltas: 0,

                            turma: chamada.turma,

                            musica: chamada.musica,

                            luta: chamada.luta,

                            atletismo: chamada.atletismo
                        };
                    }

                    if(
                        chamada.status === "Falta"
                    ) {

                        faltasPorAluno[
                            chamada.nome
                        ].faltas++;
                    }
                }
            }
        });

        if(!pesquisaIndividual) {

            for(
                const nome in faltasPorAluno
            ) {

                const aluno =
                    faltasPorAluno[nome];

                resultado.innerHTML += `
                    <div class="aluno">

                        <div class="aluno-info">

                            <div class="linha-nome-tags">

                                <strong class="nome-aluno">
                                    ${nome}
                                </strong>

                                <div class="aluno-tags-chamada">

                                    ${aluno.musica ? `
                                        <span class="tag-badge tag-musica">
                                            🎵
                                        </span>
                                    ` : ''}

                                    ${aluno.luta ? `
                                        <span class="tag-badge tag-luta">
                                            🥊
                                        </span>
                                    ` : ''}

                                    ${aluno.atletismo ? `
                                        <span class="tag-badge tag-atletismo">
                                            🏃
                                        </span>
                                    ` : ''}

                                </div>

                            </div>

                            <small>
                                ${aluno.turma}
                            </small>

                        </div>

                        <span>
                            ${aluno.faltas} faltas
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

    const colete =
        localStorage.getItem(
            "historicoColete"
        );

    const dataInicial =
        localStorage.getItem(
            "historicoDataInicial"
        );

    const dataFinal =
        localStorage.getItem(
            "historicoDataFinal"
        );

    const pesquisaIndividual =
        dataInicial === dataFinal;

    if(
        modoEdicao
        ||
        colete === "Todos"
        ||
        !pesquisaIndividual
    ) {
        return;
    }

    modoEdicao = true;

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
