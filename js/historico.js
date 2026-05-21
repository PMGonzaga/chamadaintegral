import {
    db
} from "./firebase.js";

import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

function selecionarColete(colete) {

    document.getElementById("colete").value =
        colete;

    document.querySelectorAll(".btn-colete")
    .forEach((botao) => {

        botao.classList.remove(
            "colete-selecionado"
        );
    });

    if(colete === "Amarelo") {

        document.querySelector(".btn-amarelo")
        .classList.add("colete-selecionado");
    }

    if(colete === "Azul") {

        document.querySelector(".btn-azul")
        .classList.add("colete-selecionado");
    }

    if(colete === "Verde") {

        document.querySelector(".btn-verde")
        .classList.add("colete-selecionado");
    }

    if(colete === "Todos") {

        document.querySelector(".btn-todos")
        .classList.add("colete-selecionado");
    }
}

function buscarHistorico() {

    mostrarLoading();

    const colete = document.getElementById(
        "colete"
    ).value.trim();

    const dataInicial = document.getElementById(
        "data-inicial"
    ).value;

    const dataFinal = document.getElementById(
        "data-final"
    ).value;

    if(
        colete === ""
        ||
        dataInicial === ""
        ||
        dataFinal === ""
    ) {

        alert(
            "Preencha todos os campos"
        );

        esconderLoading();

        return;
    }

    localStorage.setItem(
        "historicoColete",
        colete
    );

    localStorage.setItem(
        "historicoDataInicial",
        dataInicial
    );

    localStorage.setItem(
        "historicoDataFinal",
        dataFinal
    );

    window.location.href =
        "resultado-historico.html";
}

async function gerarRelatorioPDF() {

    mostrarLoading();

    try {

        const anoAtual =
            new Date().getFullYear();

        const dataInicial =
            `${anoAtual}-01-01`;

        const dataFinal =
            `${anoAtual}-12-31`;

        const querySnapshot = await getDocs(
            collection(db, "chamadas")
        );

        const alunosSnapshot = await getDocs(
            collection(db, "alunos")
        );

        const mapaAlunos = {};

        alunosSnapshot.forEach((documento) => {

            const aluno = documento.data();

            mapaAlunos[
                aluno.nome.toLowerCase()
            ] = aluno;
        });

        const chamadas = [];

        querySnapshot.forEach((documento) => {

            const chamada = documento.data();

            if(
                chamada.dataFormatada >= dataInicial
                &&
                chamada.dataFormatada <= dataFinal
            ) {

                chamadas.push(chamada);
            }
        });

        if(chamadas.length === 0) {

            alert(
                "Nenhum resultado encontrado no ano atual"
            );

            esconderLoading();

            return;
        }

        let totalPresencas = 0;

        let totalFaltas = 0;

        const alunos = {};

        chamadas.forEach((chamada) => {

            if(
                chamada.status === "Presente"
            ) {

                totalPresencas++;

            } else {

                totalFaltas++;
            }

            if(
                !alunos[chamada.nome]
            ) {

                const dadosAluno =
                    mapaAlunos[
                        chamada.nome.toLowerCase()
                    ] || {};

                alunos[chamada.nome] = {

                    nome: chamada.nome,

                    turma: chamada.turma,

                    colete: chamada.colete,

                    musica:
                        dadosAluno.musica || false,

                    luta:
                        dadosAluno.luta || false,

                    atletismo:
                        dadosAluno.atletismo || false,

                    presencas: 0,

                    faltas: 0
                };
            }

            if(
                chamada.status === "Presente"
            ) {

                alunos[chamada.nome]
                .presencas++;

            } else {

                alunos[chamada.nome]
                .faltas++;
            }
        });

        const totalChamadas =
            totalPresencas + totalFaltas;

        const porcentagemPresenca =
            (
                totalPresencas
                /
                totalChamadas
            ) * 100;

        const porcentagemFalta =
            (
                totalFaltas
                /
                totalChamadas
            ) * 100;

        const canvas =
            document.createElement("canvas");

        canvas.width = 500;

        canvas.height = 500;

        const ctx =
            canvas.getContext("2d");

        new Chart(ctx, {

            type: "pie",

            data: {

                labels: [
                    "Presenças",
                    "Faltas"
                ],

                datasets: [{

                    data: [
                        porcentagemPresenca,
                        porcentagemFalta
                    ],

                    backgroundColor: [
                        "#16a34a",
                        "#dc2626"
                    ]
                }]
            },

            options: {

                responsive: false,

                plugins: {

                    legend: {

                        position: "bottom"
                    }
                }
            }
        });

        await new Promise((resolve) => {

            setTimeout(resolve, 1000);
        });

        const imagemGrafico =
            canvas.toDataURL("image/png");

        const {
            jsPDF
        } = window.jspdf;

        const pdf = new jsPDF();

        pdf.setFontSize(20);

        pdf.text(
            "Relatório Geral de Faltas do Integral",
            45,
            20
        );

        pdf.setFontSize(12);

        pdf.text(
            `Ano: ${anoAtual}`,
            20,
            35
        );

        pdf.addImage(
            imagemGrafico,
            "PNG",
            25,
            50,
            160,
            160
        );

        pdf.text(
            `Presenças: ${porcentagemPresenca.toFixed(1)}%`,
            20,
            225
        );

        pdf.text(
            `Faltas: ${porcentagemFalta.toFixed(1)}%`,
            20,
            235
        );

        pdf.addPage();

        pdf.setFontSize(18);

        pdf.text(
            "Relatório por Aluno",
            60,
            20
        );

        let y = 40;

        const alunosOrdenados =
            Object.values(alunos)
            .sort((a, b) => {

                return a.nome.localeCompare(
                    b.nome,
                    "pt-BR",
                    {
                        sensitivity: "base"
                    }
                );
            });

        const coletes = [
            "Amarelo",
            "Azul",
            "Verde"
        ];

        coletes.forEach((nomeColete) => {

            const alunosColete =
                alunosOrdenados.filter(
                    (aluno) => {

                        return aluno.colete
                        === nomeColete;
                    }
                );

            if(
                alunosColete.length === 0
            ) {

                return;
            }

            if(y > 240) {

                pdf.addPage();

                y = 20;
            }

            pdf.setFontSize(15);

            pdf.setTextColor(
                0,
                0,
                0
            );

            pdf.text(
                `Colete ${nomeColete}`,
                20,
                y
            );

            y += 12;

            alunosColete.forEach((aluno) => {

                const total =
                    aluno.presencas
                    +
                    aluno.faltas;

                const porcentagemPresencaAluno =
                    (
                        aluno.presencas
                        /
                        total
                    ) * 100;

                const porcentagemFaltaAluno =
                    (
                        aluno.faltas
                        /
                        total
                    ) * 100;

                pdf.setFontSize(10);

                if(
                    porcentagemFaltaAluno === 100
                ) {

                    pdf.setTextColor(
                        220,
                        38,
                        38
                    );

                } else {

                    pdf.setTextColor(
                        0,
                        0,
                        0
                    );
                }

                const tagsAluno =
                    `${aluno.musica ? '🎵 ' : ''}`
                    +
                    `${aluno.luta ? '🥊 ' : ''}`
                    +
                    `${aluno.atletismo ? '🏃' : ''}`;

                const nomeCompleto =
                    `${aluno.nome} ${tagsAluno}`;

                const nomeQuebrado =
                    pdf.splitTextToSize(
                        nomeCompleto,
                        60
                    );

                pdf.text(
                    nomeQuebrado,
                    20,
                    y
                );

                pdf.text(
                    aluno.turma,
                    90,
                    y
                );

                pdf.text(
                    `${porcentagemPresencaAluno.toFixed(1)}%`,
                    140,
                    y
                );

                pdf.text(
                    `${porcentagemFaltaAluno.toFixed(1)}%`,
                    175,
                    y
                );

                y += (
                    nomeQuebrado.length * 6
                ) + 4;

                if(y > 270) {

                    pdf.addPage();

                    y = 20;
                }
            });

            y += 15;
        });

        const categorias = [
            {
                titulo: "Turma Música",
                campo: "musica"
            },
            {
                titulo: "Turma Luta",
                campo: "luta"
            },
            {
                titulo: "Turma Atletismo",
                campo: "atletismo"
            }
        ];

        categorias.forEach((categoria) => {

            const alunosCategoria =
                alunosOrdenados.filter((aluno) => {

                    return aluno[
                        categoria.campo
                    ];
                });

            if(alunosCategoria.length === 0) {

                return;
            }

            pdf.addPage();

            pdf.setFontSize(18);

            pdf.setTextColor(
                0,
                0,
                0
            );

            pdf.text(
                categoria.titulo,
                20,
                20
            );

            let posicaoY = 40;

            alunosCategoria.forEach((aluno) => {

                const total =
                    aluno.presencas
                    +
                    aluno.faltas;

                const porcentagemPresencaAluno =
                    (
                        aluno.presencas
                        /
                        total
                    ) * 100;

                const porcentagemFaltaAluno =
                    (
                        aluno.faltas
                        /
                        total
                    ) * 100;

                if(
                    porcentagemFaltaAluno === 100
                ) {

                    pdf.setTextColor(
                        220,
                        38,
                        38
                    );

                } else {

                    pdf.setTextColor(
                        0,
                        0,
                        0
                    );
                }

                const tagsAluno =
                    `${aluno.musica ? '🎵 ' : ''}`
                    +
                    `${aluno.luta ? '🥊 ' : ''}`
                    +
                    `${aluno.atletismo ? '🏃' : ''}`;

                const nomeCompleto =
                    `${aluno.nome} ${tagsAluno}`;

                const nomeQuebrado =
                    pdf.splitTextToSize(
                        nomeCompleto,
                        60
                    );

                pdf.setFontSize(10);

                pdf.text(
                    nomeQuebrado,
                    20,
                    posicaoY
                );

                pdf.text(
                    aluno.turma,
                    90,
                    posicaoY
                );

                pdf.text(
                    `${porcentagemPresencaAluno.toFixed(1)}%`,
                    140,
                    posicaoY
                );

                pdf.text(
                    `${porcentagemFaltaAluno.toFixed(1)}%`,
                    175,
                    posicaoY
                );

                posicaoY += (
                    nomeQuebrado.length * 6
                ) + 4;

                if(posicaoY > 270) {

                    pdf.addPage();

                    posicaoY = 20;
                }
            });
        });

        pdf.save(
            `relatorio-geral-${anoAtual}.pdf`
        );

    } finally {

        esconderLoading();
    }
}

window.buscarHistorico = buscarHistorico;

window.selecionarColete = selecionarColete;

window.gerarRelatorioPDF =
    gerarRelatorioPDF;
