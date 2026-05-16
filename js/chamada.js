let alunos = [];

async function carregarAlunos() {

    const colete = document.getElementById("colete").value;

    const formData = new FormData();

    formData.append(
        "data",
        JSON.stringify({
            action: "listarAlunosColete",
            colete
        })
    );

    const response = await fetch(API_URL, {
        method: "POST",
        body: formData
    });

    const data = await response.json();

    alunos = data;

    const lista = document.getElementById("lista-chamada");

    lista.innerHTML = "";

    if(alunos.length === 0) {

        lista.innerHTML = `
            <p>Nenhum aluno encontrado.</p>
        `;

        return;
    }

    alunos.forEach((aluno, index) => {

        lista.innerHTML += `
            <div class="aluno">

                <span>
                    ${aluno.nome} - Colete ${aluno.colete}
                </span>

                <select id="status-${index}">
                    <option value="Presente">Presente</option>
                    <option value="Falta">Falta</option>
                </select>

            </div>
        `;
    });
}

async function salvarChamada() {

    const chamada = alunos.map((aluno, index) => {

        return {
            nome: aluno.nome,
            turma: aluno.turma,
            colete: aluno.colete,
            status: document.getElementById(`status-${index}`).value
        }
    });

    const formData = new FormData();

    formData.append(
        "data",
        JSON.stringify({
            action: "salvarChamada",
            chamada
        })
    );

    await fetch(API_URL, {
        method: "POST",
        body: formData
    });

    alert("Chamada salva com sucesso");
}
