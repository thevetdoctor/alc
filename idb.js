(function () {
    'use strict';
    if (!('indexedDB' in window)) {
        console.log('This browser doesn\'t support IndexedDB');
        return;
    }
    // Let us open our database
    const dbPromise = idb.open('currency', 10, (upgradeDb) =>{
        upgradeDb.createObjectStore('currencies', { keyPath: 'id' })
    });
    fetch('https://free.currencyconverterapi.com/api/v5/currencies')
    .then(res=> res.json()).then(json=>{
        dbPromise.then((db)=>{
            if(!db)return;
            const tx = db.transaction('currencies', 'readwrite');
            const exRate = tx.objectStore('currencies');
            const curs = json.results;
            for (const key in curs) {
            const objs = curs[key];
            exRate.put(objs);
                } 
            })
        }).catch(()=>{
            dbPromise.then((db) => {
                if (!db) return;
                const tx = db.transaction('currencies');
                const store = tx.objectStore('currencies');
                store.getAll().then((currencies)=>{
                    for (const result in currencies) {
                        const option1 = document.createElement('option');
                        const option2 = document.createElement('option');
                        option1.value = currencies[result]["id"];
                        option1.appendChild(document.createTextNode(currencies[result]["currencyName"]));

                        option2.value = currencies[result]["id"];
                        option2.appendChild(document.createTextNode(currencies[result]["currencyName"]));
                        select1.appendChild(option1);
                        select2.appendChild(option2);
                    }
                })
            })
        })
    })();