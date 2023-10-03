const listaPokemon = document.querySelector("#listaPokemon");
const alertPokedex = document.querySelector("#alertPokedex");
const benvenuto = document.querySelector("#benvenuto");
let counter = localStorage.getItem("pokemonSalvati") || 0;


let utente = JSON.parse(localStorage.getItem("user"));
let idUtente = utente.id;

benvenuto.innerHTML = `Benvenuto ${utente.nome}!`;

fetch("https://pokeapi.co/api/v2/pokemon/?limit=20&offset=0")
.then(data =>{return data.json()})
.then(response =>{

    response.results.forEach(pokemon => {
        
        fetch(pokemon.url)
        .then(data =>{return data.json()})
        .then(response =>{
            const card = document.createElement("li");
            card.setAttribute("class", "list-group-item d-flex align-items-center");         
            card.innerHTML = `
                <img src="${response.sprites.front_default}" alt="">
                <span>${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</span>
            `;       
           
            let tipoPok = "";
            response.types.forEach(element => {
                tipoPok = element.type.name;
            });

            // pokemon.tipo = tipo;


            // descrizione
            let descrizioneTrovata = false
            
           

            fetch(response.species.url)
            .then(data =>{return data.json()})
            .then(descrizione =>{

                descrizione.flavor_text_entries.forEach(element => {

                    if(element.language.name == 'it' && !descrizioneTrovata){  
                        
                        console.log(element.flavor_text);
                        descrizioneTrovata = true;           
                        
                        console.log(response);
                        pokemon.descrizione = element.flavor_text;
                        pokemon.immagine = response.sprites.other.dream_world.front_default
                        
                    }
                });
            })

            const btnAggiungi = document.createElement("button");
            btnAggiungi.setAttribute("class", "btn btn-default d-inline-block ms-auto");
            btnAggiungi.textContent = "Salva nel pokedex";

            btnAggiungi.addEventListener("click", function(){
                if(counter < 3){

                    const pokemonAgg = {
                        name: pokemon.name,
                        tipo: tipoPok,
                        descrizione: pokemon.descrizione,
                        immagine: pokemon.immagine 
                    }

                    //devo fare una post nell'array pokedex in users, ma non conosco l'user che si è loggato alla pagina (lo so solo con localstorage finora)

                    fetch("http://localhost:3000/users")
                    .then(data =>{return data.json()})
                    .then(arrUtenti =>{
                        const utente = arrUtenti.find(user => user.id === idUtente);
                        if (utente){

                            fetch(`http://localhost:3000/users/${idUtente}`, {
                                method: "PATCH",
                                headers: {
                                    "Content-type": "application/json"
                                },
                                body: JSON.stringify({
                                    pokedex: [...utente.pokedex, pokemonAgg]
                                })
                            })
                            .then(promessa =>{
                                let alertAggiunto = `
                                <div class="alert alert-primary alert-dismissible fade show position-fixed bottom-0 end-0" role="alert">
                                <strong>${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)} aggiunto!</strong>
                                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                                </div>
                                `;
                                alertPokedex.innerHTML = alertAggiunto;
    
                                setTimeout(function() {
                                    alertPokedex.innerHTML = '';
                                }, 3000);
                            })
                            
                        } 
                    })
                    counter++;
                    localStorage.setItem("pokemonSalvati", counter);
                }else{
                    let alertNonAggiunto = `
                        <div class="alert alert-primary alert-dismissible fade show position-fixed bottom-0 end-0" role="alert">
                            <strong>Pokédex pieno!</strong>
                            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                        </div>
                    `;
                    alertPokedex.innerHTML = alertNonAggiunto;
                }
                
                console.log(counter);
            })

            
            card.appendChild(btnAggiungi);
            listaPokemon.appendChild(card);
        })
    });

})









            