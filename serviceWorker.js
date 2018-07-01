const cacheName = 'alc';
self.addEventListener('install', function (event) {
    // Perform install steps
    event.waitUntil(
        caches.open(cacheName).then(function (cache) {
            return cache.addAll([
                '/',
                './index.html',
                './js/idb.js',
                './js/jakeidb.js',
                './navigator.js',
                'https://free.currencyconverterapi.com/api/v5/currencies',
                'https://stackpath.bootstrapcdn.com/bootstrap/4.1.1/css/bootstrap.min.css',
            ])
        })
    );
});

self.addEventListener('activate', function (e) {
    e.waitUntil(
        caches.keys().then(function (cacheNames) {
            return Promise.all(cacheNames.map(function (thisCacheName) {
                if (thisCacheName !== cacheNames) {
                    console.log('Removing cached files', thisCacheName);
                    // return caches.delete(thisCacheName);
                }
            }))
        })
    )
})


self.addEventListener('fetch', function (event) {
    const url = 'https://free.currencyconverterapi.com/api/v5/currencies';
    if (event.request.url === url) {
        event.respondWith(
            caches.match(event.request).then(function (response) {
                if (response) {
                    console.log('found in the cache');
                    return response || fetch(event.request.url);
                }
                let requestClone = event.request.clone();
                return fetch(requestClone).then(function (response) {
                    if (!response) {
                        console.log('sw no response from fetch');
                        return response;
                    }

                    let responseClone = response.clone();
                    caches.open(cacheName).then(function (cache) {
                        console.log('new data')
                        cache.put(event.request, responseClone);
                        return response;
                    })
                }).catch(function (err) {
                    console.log('error fecthing and catching data', err);
                })
            })
        )
    }
});



