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
                    <h4 class="card-title">${element.name.charAt(0).toUpperCase() + element.name.slice(1)}</h4>
                    <p class="card-text">Tipo: ${element.tipo.charAt(0).toUpperCase() + element.tipo.slice(1)}</p>
                    <p class="card-text" id="descrizione_${element.name}">${element.descrizione}</p>    
                    <button id="modifica_${element.name}">Modifica descrizione</button>
                </div>
            </div>
        `;
        grigliaPokemon.innerHTML += cardPokemon;

        const btnModifica = document.getElementById(`modifica_${element.name}`);
        btnModifica.addEventListener("click", function(){
            const descrizione = document.querySelector(`#descrizione_${element.name}`)
            const nuovaDescrizione = prompt("Inserisci nuova descrizione:");
            descrizione.textContent = nuovaDescrizione;

            


        })
    });
    console.log(response.pokedex);


    
    
})