const nomeInput = document.querySelector("#nome");
const passwordInput = document.querySelector("#password");
const login = document.querySelector("#login");
const spazioAlert = document.querySelector("#spazioAlert");

fetch("http://localhost:3000/users")
.then(data => {return data.json()})
.then(response => {
    function loginUtente(utenti, nomeVal, passwordVal) {
        let esiste = utenti.find(u => u.nome === nomeVal && u.password === passwordVal);
        if (!esiste) {
            localStorage.setItem("pokemonSalvati", 0);
            let user = JSON.parse(localStorage.getItem("user"));
            let userId = user ? user.id : 0;
            let utente = {
                id: ++userId,
                nome: nomeInput.value,
                password: passwordInput.value,
                pokedex: []
            };
            localStorage.setItem("user", JSON.stringify(utente));
            fetch("http://localhost:3000/users", {
                method: "POST",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify(utente)
            })
            .then(utenteEsistente =>{  
                if(utenteEsistente.ok){    //una volta creato l'utente, questo if chiede "l'utente esiste?", se è true("ok" è una proprietà di response, ovvero se la richiesta ha avuto successo), allora mi sposta alla seconda pagina. E' una condizione sempre vera, poiché se l'utente non esiste viene sempre automaticamente creato, e quindi esisterà sempre un utente
                    let alert = `
                        <div class="alert alert-primary alert-dismissible fade show position-fixed bottom-0 end-0" role="alert">
                            <strong>Benvenuto ${utente.nome}!</strong> Stai per essere indirizzato alla pagina dei pokemon.
                            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                        </div>
                    `;
                    spazioAlert.innerHTML = alert;
                    console.log(utenteEsistente);
                    console.log("Nuovo utente registrato!");
                    setTimeout(() =>{
                        location.href = "pokemon.html";
                    }, 3000);
                }
            })
        }else{
            localStorage.setItem("user", JSON.stringify(esiste));
            let alert = `
                <div class="alert alert-primary alert-dismissible fade show position-fixed bottom-0 end-0" role="alert">
                    <strong>Ciao ${esiste.nome}!</strong> Stai per essere indirizzato alla pagina dei pokemon.
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
            `;
            spazioAlert.innerHTML = alert;
            setTimeout(() =>{
                location.href = "pokemon.html";
            }, 3000);
        } 
    }
    login.addEventListener("click", function(){
        loginUtente(response, nomeInput.value, passwordInput.value);
    })
})    


