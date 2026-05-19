const tituloDashboard = document.getElementById(
    "titulo-dashboard"
);

const usuarioLogado = JSON.parse(
    localStorage.getItem("usuarioLogado")
);

if(
    usuarioLogado
    &&
    usuarioLogado.nome
) {

    tituloDashboard.innerText =
        `Olá ${usuarioLogado.nome}`;

} else {

    tituloDashboard.innerText =
        "Olá Professor";
}
