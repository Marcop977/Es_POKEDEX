const grigliaPokemon = document.querySelector("#grigliaPokemon");
const pokedexUtente = document.querySelector("#pokedexUtente");
let userPokedex = JSON.parse(localStorage.getItem("user"));
let userPokedexId = userPokedex.id;

pokedexUtente.innerHTML = `Pokédex di ${userPokedex.nome}`;

fetch(`http://localhost:3000/users/${userPokedexId}`)
.then(data =>{return data.json()})
.then(response =>{
    console.log(response);
    response.pokedex.forEach(element => {
        let cardPokemon = `
            <div class="card col-3 m-2 text-center d-flex justify-content-center">
                <img class="card-img-top w-50 mx-auto py-5" src="${element.immagine}" alt="Title">
                <div class="card-body h-100 d-flex flex-column justify-content-end">
                    <h4 class="card-title" id="nome_${element.name}">${element.name.charAt(0).toUpperCase() + element.name.slice(1)}</h4>
                    <p class="card-text" id="tipo_${element.name}">Tipo: ${element.tipo.charAt(0).toUpperCase() + element.tipo.slice(1)}</p>
                    <p class="card-text" id="descrizione_${element.name}">${element.descrizione}</p>   
                    <button id="modificaNome" data-name="${element.name}">Modifica nome</button>
                    <button id="modificaTipo" data-name="${element.name}">Modifica tipo</button>
                    <button id="modificaDescrizione" data-name="${element.name}">Modifica descrizione</button>
                    <button id="localizzaPokemon" data-name="${element.name}">Localizza</button>
                    <button id="inserisciIndirizzo" data-name="${element.name}">Inserisci indirizzo</button>
                </div>
            </div>
        `;
        grigliaPokemon.innerHTML += cardPokemon;
        // console.log(element);

    })
    
    const btnModifica = document.querySelectorAll(`#modificaDescrizione`);
    btnModifica.forEach(button => {
        button.addEventListener("click", function(){
            const pokemonNome = this.dataset.name;  //prendo il valore di data-name
            const descrizione = document.querySelector(`#descrizione_${pokemonNome}`)  //prendo l'id di ogni descrizione
            const nuovaDescrizione = prompt("Inserisci nuova descrizione:");
            if(nuovaDescrizione != ""){
                descrizione.textContent = nuovaDescrizione;
        
        
                const pokemonDaModificare = response.pokedex.find(pokemon => pokemon.name === pokemonNome); //all'interno del pokedex, prendo i pokemon il cui nome è lo stesso di data-name così da avere il pokemon da modificare
                pokemonDaModificare.descrizione = nuovaDescrizione;
        
                fetch(`http://localhost:3000/users/${userPokedexId}`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ pokedex: response.pokedex })  //una volta aggiornato il campo descrizione, aggiorno tutto l'array pokedex
                })

            }else{
                alert("Non puoi lasciare il campo vuoto");
            }
        })
    });
    const btnLocalizza = document.querySelectorAll("#localizzaPokemon");
    btnLocalizza.forEach(button => {
        button.addEventListener("click", function(event){
            const mappaEsiste = document.querySelector("#map");
            if (mappaEsiste) {
                mappaEsiste.remove();            
            }
            

            const meteoEsiste = document.querySelector(".meteo-info");
            if(meteoEsiste){
                meteoEsiste.remove();
            }

            let formIndirizzo = `
                <div id="map" style="width: 100%; height: 400px"></div>
            `;

            let formContainer = document.createElement('div');
            formContainer.innerHTML = formIndirizzo;
            button.parentNode.appendChild(formContainer);  //parentNode restituisce l'elemento HTML che contiene il bottone

            const map = L.map("map").setView([51.505, -0.09], 13); //crea una mappa leaflet e la imposta su quelle coordinate
            L.tileLayer("//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);  //aggiunge un layer(es immagine mappa) da openstreetmap
            const provider = new GeoSearch.OpenStreetMapProvider(); // provider per geocoding, geocodifica l'indirizzo in coordinate 
            let marker;
            event.preventDefault();
            const address = response.pokedex[0].indirizzo;
            const results = provider.search({query: address}); // cerca l'indirizzo usando il provider di geocodifica
            results.then(data => {  //esegue un'azione quando la promessa si risolve, quando i dati sono disponibili
                const location = data[0];  //prende quello all'indice 0
                if (marker) {                       //se il marker esiste già, lo rimuove
                    map.removeLayer(marker);
                }
                
                const iconaMarker = L.icon({
                    iconUrl: 'img/1200px-Pokémon_GO_Plus.svg.png',
                    iconSize: [35, 50],
                });

                marker = L.marker([location.y, location.x], { icon: iconaMarker }).addTo(map);  // imposta il marker sulle coordinate
                map.setView([location.y, location.x], 13);     //imposta la mappa sulle coordinate
                
                const apiKey = 'd97b4d77c47e13daf78490b260c54900'; // Sostituisci con la tua chiave API
                const meteoApi = `https://api.openweathermap.org/data/2.5/weather?lat=${location.y}&lon=${location.x}&appid=${apiKey}&units=metric`;

                console.log(location);
                fetch(meteoApi)
                .then(response => response.json())
                .then(meteo => {
                    console.log(meteo);
                    const div = document.createElement("div");
                    div.classList.add("meteo-info");
                    div.innerHTML = `
                        <p>Temperatura: <strong> ${meteo.main.temp} °</strong></p>
                        <p>Cielo: <strong>${meteo.weather[0].description}</strong></p> 
                        <p>Umidità: <strong>${meteo.main.humidity} %</strong></p> 
                        <p>Vento: <strong>${meteo.wind.speed} Km/h</strong></p> 
                    `;
                    button.parentNode.appendChild(div);
                })
            })

           
        });
    });
    
    const btnIndirizzo = document.querySelectorAll(`#inserisciIndirizzo`);
    btnIndirizzo.forEach(button => {
        button.addEventListener("click", function(){

            const formEsiste = document.querySelector("#addressForm");
            if(formEsiste){
                formEsiste.remove();
            }

            const mappaEsiste = document.querySelector("#map");
            if (mappaEsiste) {
                mappaEsiste.remove();            
            }

            const meteoEsiste = document.querySelector(".meteo-info");
            if(meteoEsiste){
                meteoEsiste.remove();
            }
            let formIndirizzo = `
                <form id="addressForm">
                    <label for="indirizzo"></label>
                    <input type="text" id="indirizzo" placeholder="Inserisci indirizzo" />
                    <button type="submit" id="cerca">Mostra mappa</button>
                </form>
                <div id="map" style="width: 100%; height: 400px"></div>
            `;

            let formContainer = document.createElement('div');
            formContainer.innerHTML = formIndirizzo;
            button.parentNode.appendChild(formContainer);  //parentNode restituisce l'elemento HTML che contiene il bottone

            const map = L.map("map").setView([51.505, -0.09], 13); //crea una mappa leaflet e la imposta su quelle coordinate
            L.tileLayer("//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);  //aggiunge un layer(es immagine mappa) da openstreetmap
            const provider = new GeoSearch.OpenStreetMapProvider(); // provider per geocoding, geocodifica l'indirizzo in coordinate 

            let marker;
            document.getElementById("addressForm").addEventListener("submit", function (event) {
                event.preventDefault();
                let address = document.getElementById("indirizzo").value;

                if(address.trim() == ""){
                    alert("Non puoi lasciare il campo vuoto");
                }else{
                    const results = provider.search({query: address}); // cerca l'indirizzo usando il provider di geocodifica
                    results.then(data => {  //esegue un'azione quando la promessa si risolve, quando i dati sono disponibili
                        const location = data[0];  //prende quello all'indice 0
                        if (marker) {                       //se il marker esiste già, lo rimuove
                            map.removeLayer(marker);
                        }
                        
                        const iconaMarker = L.icon({
                            iconUrl: 'img/1200px-Pokémon_GO_Plus.svg.png',
                            iconSize: [35, 50],
                        });
    
                        marker = L.marker([location.y, location.x], { icon: iconaMarker }).addTo(map);  // imposta il marker sulle coordinate
                        map.setView([location.y, location.x], 13);     //imposta la mappa sulle coordinate
                        
                        const apiKey = 'd97b4d77c47e13daf78490b260c54900'; // Sostituisci con la tua chiave API
                        const meteoApi = `https://api.openweathermap.org/data/2.5/weather?lat=${location.y}&lon=${location.x}&appid=${apiKey}&units=metric`;
        
                        console.log(location);
                        fetch(meteoApi)
                        .then(response => response.json())
                        .then(meteo => {
                            const div = document.createElement("div");
                            div.setAttribute("id", "meteo-info");
                            div.innerHTML = `
                                <p>Temperatura: <strong> ${meteo.main.temp} °</strong></p>
                                <p>Cielo: <strong>${meteo.weather[0].description}</strong></p> 
                                <p>Umidità: <strong>${meteo.main.humidity} %</strong></p> 
                                <p>Vento: <strong>${meteo.wind.speed} Km/h</strong></p> 
                            `;
                            button.parentNode.appendChild(div);
                            
                        })
                    
                    })

                }



            })

  
        });
        
    });





    const btnNome = document.querySelectorAll(`#modificaNome`);
    btnNome.forEach(button => {
        button.addEventListener("click", function(){
            const pokemonNome = this.dataset.name;  //prendo il valore di data-name
            const nomeCampo = document.querySelector(`#nome_${pokemonNome}`)  //prendo l'id di ogni descrizione
            const nuovoNome = prompt("Inserisci nuovo nome:");
            if(nuovoNome != ""){
                nomeCampo.textContent = nuovoNome;
        
        
                const pokemonDaModificare = response.pokedex.find(pokemon => pokemon.name === pokemonNome); //all'interno del pokedex, prendo i pokemon il cui nome è lo stesso di data-name così da avere il pokemon da modificare
                pokemonDaModificare.name = nuovoNome;
        
                fetch(`http://localhost:3000/users/${userPokedexId}`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ pokedex: response.pokedex })  //una volta aggiornato il campo descrizione, aggiorno tutto l'array pokedex
                })

            }else{
                alert("Non puoi lasciare il campo vuoto");
            }
        })
    });

    const btnTipo = document.querySelectorAll(`#modificaTipo`);
    btnTipo.forEach(button => {
        button.addEventListener("click", function(){
            const pokemonNome = this.dataset.name;  //prendo il valore di data-name
            const tipoCampo = document.querySelector(`#tipo_${pokemonNome}`)  //prendo l'id di ogni descrizione
            const nuovoTipo = prompt("Inserisci nuovo tipo:");
            if(nuovoTipo != ""){
                tipoCampo.textContent = nuovoTipo;
        
        
                const pokemonDaModificare = response.pokedex.find(pokemon => pokemon.name === pokemonNome); //all'interno del pokedex, prendo i pokemon il cui nome è lo stesso di data-name così da avere il pokemon da modificare
                pokemonDaModificare.tipo = nuovoTipo;
        
                fetch(`http://localhost:3000/users/${userPokedexId}`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ pokedex: response.pokedex })  //una volta aggiornato il campo descrizione, aggiorno tutto l'array pokedex
                })

            }else{
                alert("Non puoi lasciare il campo vuoto");
            }
        })
    });
})