async function cadastrarAluno() {

    const nome = document.getElementById("nome").value;
    const turma = document.getElementById("turma").value;
    const colete = document.getElementById("colete").value;

    await fetch(API_URL, {
        method: "POST",
        body: JSON.stringify({
            action: "cadastrarAluno",
            nome,
            turma,
            colete
        })
    });

    alert("Aluno cadastrado");

    listarAlunos();
}

async function listarAlunos() {

    const response = await fetch(API_URL, {
        method: "POST",
        body: JSON.stringify({
            action: "listarAlunos"
        })
    });

    const alunos = await response.json();

    const lista = document.getElementById("lista-alunos");

    lista.innerHTML = "";

    alunos.forEach(aluno => {

        lista.innerHTML += `
            <div class="aluno">
                <span>
                    ${aluno.nome} - ${aluno.turma} - Colete ${aluno.colete}
                </span>
            </div>
        `;
    });
}

listarAlunos();