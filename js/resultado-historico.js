import {

    const diferencaDias = Math.ceil(
        (dataFinal - dataInicial)
        /
        (1000 * 60 * 60 * 24)
    );

    const faltasPorAluno = {};

    querySnapshot.forEach((doc) => {

        const chamada = doc.data();

        const dataChamada = chamada.data.toDate();

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
