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

window.buscarHistorico = buscarHistorico;

window.selecionarColete = selecionarColete;
