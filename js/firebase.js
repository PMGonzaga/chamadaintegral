import { initializeApp }
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import { getAuth }
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import { getFirestore }
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {

    apiKey: "AIzaSyDpkpoabYifjVAqcand-GyHedFymxkt7IQ",

    authDomain: "lista-chamada-escola.firebaseapp.com",

    projectId: "lista-chamada-escola",

    storageBucket: "lista-chamada-escola.firebasestorage.app",

    messagingSenderId: "712228308178",

    appId: "1:712228308178:web:0beb3c9eb6727643dd590b",

    measurementId: "G-0MYRDXM13W"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);

export { auth, db };
