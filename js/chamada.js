let alunos = [];

async function carregarAlunos() {

    const colete = document.getElementById("colete").value;

    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: `data=${encodeURIComponent(JSON.stringify({
            action: "listarAlunosColete",
            colete
        }))}`
    });

    alunos = await response.json();

    const lista = document.getElementById("lista-chamada");

    lista.innerHTML = "";

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

    await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: `data=${encodeURIComponent(JSON.stringify({
            action: "salvarChamada",
            chamada
        }))}`
    });

    alert("Chamada salva com sucesso");
}
