import {
    db
} from "./firebase.js";

import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

async function carregarHistorico() {

    alert("Script carregou");

    const querySnapshot = await getDocs(
        collection(db, "chamadas")
    );

    alert(
        "Documentos encontrados: "
        +
        querySnapshot.size
    );

    querySnapshot.forEach((doc) => {

        console.log(doc.data());
    });
}

carregarHistorico();
