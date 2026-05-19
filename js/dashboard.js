const titulo = document.getElementById(
    "titulo-dashboard"
);

const nomeProfessor = localStorage.getItem(
    "nomeProfessor"
);

if(nomeProfessor) {

    titulo.innerText =
        `Olá ${nomeProfessor}`;

} else {

    titulo.innerText =
        "Olá Professor";
}
