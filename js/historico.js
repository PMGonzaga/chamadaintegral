function buscarHistorico() {

    mostrarLoading();

    const colete = document.getElementById("colete").value
    .trim();

    const dataInicial = document.getElementById(
        "data-inicial"
    ).value;

    const dataFinal = document.getElementById(
        "data-final"
    ).value;

    if(
        !colete
        ||
        !dataInicial
        ||
        !dataFinal
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

window.buscarHistorico = buscarHistorico;
