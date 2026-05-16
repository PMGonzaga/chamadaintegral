function buscarHistorico() {

    mostrarLoading();

    const colete = document.getElementById("colete").value
    .trim();

    const dataInicial = document.getElementById(
        "data-inicial"
    ).value;

    let dataFinal = document.getElementById(
        "data-final"
    ).value;

    if(dataFinal === "") {

        dataFinal = dataInicial;
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
