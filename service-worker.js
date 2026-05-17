const CACHE_NAME = "chamada-escola-v5";

const urlsToCache = [

    "./",

    "./index.html",

    "./dashboard.html",

    "./alunos.html",

    "./chamada.html",

    "./historico.html",

    "./resultado-historico.html",

    "./css/style.css",

    "./js/app.js",

    "./js/auth.js",

    "./js/firebase.js",

    "./js/alunos.js",

    "./js/chamada.js",

    "./js/historico.js",

    "./js/resultado-historico.js"
];

self.addEventListener("install", (event) => {

    event.waitUntil(

        caches.open(CACHE_NAME)
        .then((cache) => {

            return cache.addAll(urlsToCache);
        })
    );
});

self.addEventListener("fetch", (event) => {

    event.respondWith(

        caches.match(event.request)
        .then((response) => {

            return response || fetch(event.request);
        })
    );
});
