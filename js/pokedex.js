const grigliaPokemon = document.querySelector("#grigliaPokemon");
const pokedexUtente = document.querySelector("#pokedexUtente");
let userPokedex = JSON.parse(localStorage.getItem("user"));
let userPokedexId = userPokedex.id;

pokedexUtente.innerHTML = `Pokédex di ${userPokedex.nome}`;

fetch(`http://localhost:3000/users/${userPokedexId}`)
.then(data =>{return data.json()})
.then(response =>{
    
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
                </div>
            </div>
        `;
        grigliaPokemon.innerHTML += cardPokemon;
        console.log(element);

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



    const btnNome = document.querySelectorAll(`#modificaNome`);
    btnNome.forEach(button => {
        button.addEventListener("click", function(){
            const pokemonNome = this.dataset.name;  //prendo il valore di data-name
            const descrizione = document.querySelector(`#nome_${pokemonNome}`)  //prendo l'id di ogni descrizione
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

    const btnTipo = document.querySelectorAll(`#modificaTipo`);
    btnTipo.forEach(button => {
        button.addEventListener("click", function(){
            const pokemonNome = this.dataset.name;  //prendo il valore di data-name
            const descrizione = document.querySelector(`#tipo_${pokemonNome}`)  //prendo l'id di ogni descrizione
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
})

