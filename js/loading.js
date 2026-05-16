function mostrarLoading() {

    document
    .getElementById("loading")
    .classList.add("active");
}

function esconderLoading() {

    document
    .getElementById("loading")
    .classList.remove("active");
}

window.mostrarLoading = mostrarLoading;

window.esconderLoading = esconderLoading;
