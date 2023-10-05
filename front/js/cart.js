let panier = JSON.parse(localStorage.getItem("panier"));

// faire parse, foreach pour afficher les element du panier, insert html et le remove si suprimmer dans le panier et le local storage




function afficherPanier() {
    const produitPanier = JSON.parse(localStorage.getItem("panier"));
    const panier = document.querySelector(".panier");

    if(!produitPanier || produitPanier.length === 0) {
        panier.insertAdjacentHTML = `
        <div class="panier">
            <p>Votre panier est vide</p>
        </div>
        `;
        return
    }
    // const id = produitPanier.map(el => el.id);
    // async function fetch(id) {
    //     const req = await fetch(`http://localhost:3000/api/products/${id}`);
    //     const data = await req.json();
    //     return data;
    // }

    produitPanier.forEach(async (el, index) => {
        let produit = await fetch(`http://localhost:3000/api/products/${el.id}`);
        produit = await produit.json()
        const panier = document.querySelector(".panier");
        panier.innerHTML += `
            <div class="ProduitsPanier">
                <p>${el.image}</p>
                <p>${el.titre}</p>
                <p>${el.prix}</p>
                <p>${el.quantite}</p>
                <p>${el.format}</p>
                <button class="supprimer" onclick="supprimer(${index})">Supprimer</button>
            </div>
        `;
    });


    
}


afficherPanier();





