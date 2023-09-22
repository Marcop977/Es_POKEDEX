const listaPokemon = document.querySelector("#listaPokemon");
const alertPokedex = document.querySelector("#alertPokedex");
let counter = 0;


fetch("https://pokeapi.co/api/v2/pokemon/?limit=20&offset=0")
.then(data =>{return data.json()})
.then(response =>{
    console.log(response);
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
           
            const btnAggiungi = document.createElement("button");
            btnAggiungi.setAttribute("class", "btn btn-default d-inline-block ms-auto");
            btnAggiungi.textContent = "Salva nel pokedex";

            btnAggiungi.addEventListener("click", function(){
                if(counter < 3){
                    
                    fetch("http://localhost:3000/results", {
                        method: "POST",
                        headers: {
                            "Content-type": "application/json"
                        },
                        body: JSON.stringify(pokemon)
                    })
                    .then(response =>{
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
                }else{
                    let alertNonAggiunto = `
                        <div class="alert alert-primary alert-dismissible fade show position-fixed bottom-0 end-0" role="alert">
                            <strong>Pokédex pieno!</strong>
                            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                        </div>
                    `;
                    alertPokedex.innerHTML = alertNonAggiunto;
                }
                counter++;
            })

            
            card.appendChild(btnAggiungi);
            listaPokemon.appendChild(card);
        })
    });

})