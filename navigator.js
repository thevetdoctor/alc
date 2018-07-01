if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('serviceWorker.js',{scope:'/'})
    .then(function(reg){
        console.log('registration was successful')
    }).catch(function(err){
        console.log('ServiceWorker registration failed: ', err);
    }) 
}
