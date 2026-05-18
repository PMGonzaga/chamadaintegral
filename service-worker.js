const CACHE_NAME = "chamada-escola-v25";

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

    "./js/resultado-historico.js",

    "./js/loading.js"
];

self.addEventListener("install", (event) => {

    self.skipWaiting();

    event.waitUntil(

        caches.open(CACHE_NAME)
        .then((cache) => {

            return cache.addAll(urlsToCache);
        })
    );
});

self.addEventListener("activate", (event) => {

    event.waitUntil(

        caches.keys().then((cacheNames) => {

            return Promise.all(

                cacheNames.map((cache) => {

                    if(cache !== CACHE_NAME) {

                        return caches.delete(cache);
                    }
                })
            );
        })
    );

    self.clients.claim();
});

self.addEventListener("fetch", (event) => {

    if(event.request.method !== "GET") {

        return;
    }

    event.respondWith(

        fetch(event.request)

        .then((response) => {

            const responseClone =
                response.clone();

            caches.open(CACHE_NAME)
            .then((cache) => {

                cache.put(
                    event.request,
                    responseClone
                );
            });

            return response;

        })

        .catch(() => {

            return caches.match(
                event.request
            );
        })
    );
});
