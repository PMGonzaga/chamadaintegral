const PLANILHA_ID = '1DqefvVJIHkJz43GpTRa7cXJFBmU_KibElKhgd3pYFR8';

function doGet() {

    return ContentService
    .createTextOutput("API online")
    .setMimeType(ContentService.MimeType.TEXT);
}

function doPost(e) {

    const data = JSON.parse(e.postData.contents);

    switch(data.action) {

        case 'login':
            return login(data);

        case 'cadastrarAluno':
            return cadastrarAluno(data);

        case 'listarAlunos':
            return listarAlunos();

        case 'listarAlunosColete':
            return listarAlunosColete(data);

        case 'salvarChamada':
            return salvarChamada(data);
    }
}

function login(data) {

    const sheet = SpreadsheetApp.openById(PLANILHA_ID)
    .getSheetByName('Professores');

    const valores = sheet.getDataRange().getValues();

    for(let i = 1; i < valores.length; i++) {

        if(
            valores[i][1] == data.email &&
            valores[i][2] == data.senha
        ) {
            return json({
                success: true,
                nome: valores[i][0]
            });
        }
    }

    return json({ success: false });
}

function cadastrarAluno(data) {

    const sheet = SpreadsheetApp.openById(PLANILHA_ID)
    .getSheetByName('Alunos');

    sheet.appendRow([
        new Date(),
        data.nome,
        data.turma,
        data.colete
    ]);

    return json({ success: true });
}

function listarAlunos() {

    const sheet = SpreadsheetApp.openById(PLANILHA_ID)
    .getSheetByName('Alunos');

    const valores = sheet.getDataRange().getValues();

    const alunos = [];

    for(let i = 1; i < valores.length; i++) {

        alunos.push({
            nome: valores[i][1],
            turma: valores[i][2],
            colete: valores[i][3]
        });
    }

    return json(alunos);
}

function listarAlunosColete(data) {

    const sheet = SpreadsheetApp.openById(PLANILHA_ID)
    .getSheetByName('Alunos');

    const valores = sheet.getDataRange().getValues();

    const alunos = [];

    for(let i = 1; i < valores.length; i++) {

        if(valores[i][3] == data.colete) {

            alunos.push({
                nome: valores[i][1],
                turma: valores[i][2],
                colete: valores[i][3]
            });
        }
    }

    return json(alunos);
}

function salvarChamada(data) {

    const sheet = SpreadsheetApp.openById(PLANILHA_ID)
    .getSheetByName('Chamadas');

    data.chamada.forEach(aluno => {

        sheet.appendRow([
            new Date(),
            aluno.nome,
            aluno.turma,
            aluno.colete,
            aluno.status
        ]);
    });

    return json({ success: true });
}

function json(data) {

    return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}