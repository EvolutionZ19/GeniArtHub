// // Fonction pour supprimer un article du panier
// function supprimerArticle(index) {
//     let produitPanier = JSON.parse(localStorage.getItem("panier"));

//     if (produitPanier && produitPanier.length > index) {
//         produitPanier.splice(index, 1);
//         localStorage.setItem("panier", JSON.stringify(produitPanier));
//         afficherPanier(); // Mettez à jour l'affichage du panier
//     }
// }

// // Cette fonction affiche le panier
// async function afficherPanier() {
//     const produitPanier = JSON.parse(localStorage.getItem("panier"));
//     const panierDiv = document.querySelector(".panier");
//     const total = document.querySelector(".total");
//     let prixTotal = 0;

//     if (!panierDiv) {
//         console.error("L'élément .panier n'a pas été trouvé.");
//         return; // Sortir de la fonction s'il n'y a pas d'élément .panier
//     }

//     if (!produitPanier || produitPanier.length === 0) {
//         panierDiv.innerHTML = `
//             <div class="panier">
//                 <p>Votre panier est vide</p>
//             </div>
//         `;
//     } else {
//         panierDiv.innerHTML = ""; // Efface le contenu précédent du panier
//         for (const el of produitPanier) {
//             try {
//                 let produit = await fetch(`http://localhost:3000/api/products/${el.id}`);
//                 produit = await produit.json();
//                 const declinaisons = produit.declinaisons.findIndex(item => item.taille === el.format);
//                 const prixProduit = declinaisons;
//                 const produitDiv = document.createElement("div");
//                 produitDiv.classList.add("ProduitsPanier");
//                 produitDiv.innerHTML = `
//                     <img src="${produit.image}" alt="${produit.titre}">
//                     <p>${produit.titre}</p>
//                     <p>${produit.declinaisons[prixProduit].prix} €</p>
//                     <p>quantité : ${el.quantite}</p>
//                     <p>${el.format}</p>
//                     <a href="#" class="supprimer" data-index="${produitPanier.indexOf(el)}">Supprimer</a>
//                     <hr>
//                 `;
//                 panierDiv.appendChild(produitDiv);
//                 prixTotal += produit.declinaisons[prixProduit].prix * el.quantite;
//             } catch (error) {
//                 console.error("Erreur lors de la récupération du produit :", error);
//             }
//         }

//         // Ajoutez un gestionnaire d'événements pour chaque lien "Supprimer"
//         const supprimerLiens = document.querySelectorAll(".supprimer");
//         supprimerLiens.forEach((lien, index) => {
//             lien.addEventListener("click", (e) => {
//                 e.preventDefault();
//                 supprimerArticle(index);
//             });
//         });
//     }

//     total.innerHTML = `
//         <p>Total : ${prixTotal.toFixed(2)} €</p>
//     `;
// }

// // Cette fonction affiche les éléments du panier au chargement de la page
// document.addEventListener('DOMContentLoaded', () => {
//     afficherPanier();
// });

// function numberItem() {
//     const cart = JSON.parse(localStorage.getItem('panier')) || [];
//     const cartIcon = document.querySelector("#carticon span");
//     if (cartIcon) {
//         if (cart.length > 0) {
//             const quantite = cart.reduce((acc, item) => acc + item.quantite, 0);
//             cartIcon.textContent = quantite;
//         } else {
//             cartIcon.textContent = "";
//         }
//     } else {
//         console.error("L'élément #carticon n'a pas été trouvé.");
//     }
// }
    
// numberItem();


// Fonction pour supprimer un article du panier
function supprimerArticle(index) {
    let produitPanier = JSON.parse(localStorage.getItem("panier"));

    if (produitPanier && produitPanier.length > index) {
        produitPanier.splice(index, 1);
        localStorage.setItem("panier", JSON.stringify(produitPanier));
        afficherPanier(); // Mettez à jour l'affichage du panier
    }
}

// Fonction pour mettre à jour la quantité d'un produit dans le panier
function mettreAJourQuantite(index, nouvelleQuantite) {
    let produitPanier = JSON.parse(localStorage.getItem("panier"));

    if (produitPanier && produitPanier.length > index) {
        if (nouvelleQuantite <= 0) {
            // Supprimez le produit si la quantité est nulle ou négative
            produitPanier.splice(index, 1);
        } else {
            // Mettez à jour la quantité du produit
            produitPanier[index].quantite = nouvelleQuantite;
        }

        // Sauvegardez les modifications dans localStorage
        localStorage.setItem("panier", JSON.stringify(produitPanier));

        // Rafraîchissez l'affichage du panier
        afficherPanier();
    }
}

// Cette fonction affiche le panier
async function afficherPanier() {
    const produitPanier = JSON.parse(localStorage.getItem("panier"));
    const panierDiv = document.querySelector(".panier");
    const total = document.querySelector(".total");
    let prixTotal = 0;

    if (!panierDiv) {
        console.error("L'élément .panier n'a pas été trouvé.");
        return; // Sortir de la fonction s'il n'y a pas d'élément .panier
    }

    if (!produitPanier || produitPanier.length === 0) {
        panierDiv.innerHTML = `
            <div class="panier">
                <p>Votre panier est vide</p>
            </div>
        `;
    } else {
        panierDiv.innerHTML = ""; // Efface le contenu précédent du panier
        for (const el of produitPanier) {
            try {
                let produit = await fetch(`http://localhost:3000/api/products/${el.id}`);
                produit = await produit.json();
                const declinaisons = produit.declinaisons.findIndex(item => item.taille === el.format);
                const prixProduit = declinaisons;
                const produitDiv = document.createElement("div");
                produitDiv.classList.add("ProduitsPanier");
                produitDiv.innerHTML = `
                    <img src="${produit.image}" alt="${produit.titre}">
                    <p>${produit.titre}</p>
                    <p>${produit.declinaisons[prixProduit].prix} €</p>
                    <p>quantité : <input type="number" class="quantite-input" value="${el.quantite}" min="1"></p>
                    <p>${el.format}</p>
                    <a href="#" class="supprimer" data-index="${produitPanier.indexOf(el)}">Supprimer</a>
                    <hr>
                `;
                panierDiv.appendChild(produitDiv);
                prixTotal += produit.declinaisons[prixProduit].prix * el.quantite;
            } catch (error) {
                console.error("Erreur lors de la récupération du produit :", error);
            }
        }

        // Ajoutez un gestionnaire d'événements pour chaque lien "Supprimer"
        const supprimerLiens = document.querySelectorAll(".supprimer");
        supprimerLiens.forEach((lien, index) => {
            lien.addEventListener("click", (e) => {
                e.preventDefault();
                supprimerArticle(index);
            });
        });

        // Ajoutez un gestionnaire d'événements pour chaque champ de quantité
        const quantiteChamps = document.querySelectorAll(".quantite-input");
        quantiteChamps.forEach((champ, index) => {
            champ.addEventListener("change", (e) => {
                const nouvelleQuantite = parseInt(e.target.value, 10);
                mettreAJourQuantite(index, nouvelleQuantite);
            });
        });
    }

    total.innerHTML = `
        <p>Total : ${prixTotal.toFixed(2)} €</p>
    `;
}

// Cette fonction affiche les éléments du panier au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    afficherPanier();
});
