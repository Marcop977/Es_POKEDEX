const grigliaPokemon = document.querySelector("#grigliaPokemon");
let userPokedex = JSON.parse(localStorage.getItem("user"));
let userPokedexId = userPokedex.id;

fetch("https://pokeapi.co/api/v2/pokemon/?limit=20&offset=0")
.then(data =>{return data.json()})
.then(response =>{

    response.results.forEach(pokemon => {


        fetch(pokemon.url)
        .then(data =>{return data.json()})
        .then(response =>{
            let descrizioneTrovata = false
            fetch(response.species.url)
            .then(data =>{return data.json()})
            .then(descrizione =>{
                // console.log(descrizione);
                descrizione.flavor_text_entries.forEach(element => {

                    if(element.language.name == 'it' && !descrizioneTrovata){  
                        
                        // console.log(pokemon);
                        descrizioneTrovata = true;           
                        
                        console.log(response.sprites.other.dream_world);
                        
                        let cardPokemon = `
                            <div class="col-3">
                              <div class="card text-center d-flex justify-content-center">
                                <img class="card-img-top w-50 mx-auto py-5" src="${response.sprites.other.dream_world.front_default}" alt="Title">
                                <div class="card-body h-100 d-flex flex-column justify-content-end">
                                    <h4 class="card-title" id="nome_${pokemon.name}">${pokemon.name}</h4>
                                    <p class="card-text" id="tipo_${pokemon.name}">Tipo: ${response.types[0].type.name}</p>
                                    <p class="card-text" id="descrizione_${pokemon.name}">${element.flavor_text}</p>   
                                    <button id="acquista" data-name="${pokemon.name}">Acquista</button>
                                </div>
                              </div>
                            </div>
                        `;
                        
                        grigliaPokemon.innerHTML += cardPokemon;

                        const btnAcquista = document.querySelectorAll("#acquista");
                        btnAcquista.forEach(button => {
                            button.addEventListener("click", function(){

                                fetch(`http://localhost:3000/users/${userPokedexId}`)
                                .then(data =>{return data.json()})
                                .then(res =>{
    
                                    console.log(res);
    
                                    const utente1 = {
                                        nome: res.nome,
                                        cognome: res.password
                                    }
                                    
                                    const ordine1 = {
                                        descrizione: element.flavor_text,
                                        nomeArticolo: pokemon.name                                      
                                    }
                                    
                                    
                                    fetch("http://localhost:9005/api/utenti", {
                                        method: "POST",
                                        headers: {
                                            "Content-Type": "application/json"
                                        },
                                        body: JSON.stringify(utente1)
                                    })
                                    .then(data =>{return data.json()})
    
                                    fetch("http://localhost:9005/api/ordini", {
                                        method: "POST",
                                        headers: {
                                            "Content-Type": "application/json"
                                        },
                                        body: JSON.stringify(ordine1)
                                    })
                                    .then(data =>{return data.json()})
    
                                })
                                
                            })
                        });
                    }
                });
        })
    });
})

})
