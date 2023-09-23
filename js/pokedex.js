const grigliaPokemon = document.querySelector("#grigliaPokemon");
const pokedexUtente = document.querySelector("#pokedexUtente");
let userPokedex = JSON.parse(localStorage.getItem("user"));
let userPokedexId = userPokedex.id;

pokedexUtente.innerHTML = `Pokédex di ${userPokedex.nome}`;

fetch(`http://localhost:3000/users/${userPokedexId}`)
.then(data =>{return data.json()})
.then(response =>{

    response.pokedex.forEach(pok => {

        fetch(pok.url)
        .then(data =>{return data.json()})
        .then(abilita =>{
            
            let descrizioneTrovata = false
            
            fetch(abilita.species.url)
            .then(data =>{return data.json()})
            .then(descrizione =>{

                descrizione.flavor_text_entries.forEach(element => {

                    if(element.language.name == 'it' && !descrizioneTrovata){  
                        
                        console.log(element.flavor_text);
                        descrizioneTrovata = true;           //essendo che ci sono molte descrizioni in italiano, non appena ne trova una, il valore diventa true
                        
                        let cardPokemon = `
                            <div class="card col-3 m-2 text-center d-flex justify-content-center">
                                <img class="card-img-top w-50 mx-auto py-5" src="${abilita.sprites.other.dream_world.front_default}" alt="Title">
                                <div class="card-body">
                                    <h4 class="card-title">${pok.name.charAt(0).toUpperCase() + pok.name.slice(1)}</h4>
                                    <p class="card-text">${element.flavor_text}</p>
                                </div>
                            </div>
                        `;
                        
                        grigliaPokemon.innerHTML += cardPokemon;
                        
                    }
                });
            })
        })
        
    });
})