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

// si le panier est vide afficher un message "votre panier est vide, Veuillez ajouter des articles à votre panier"

function afficherPanierVide() {
    const panierVide = document.querySelector(".panier");
    if (panierVide) {
        panierVide.innerHTML = `
            <div class="panier">
                <p>Votre panier est vide</p>
            </div>
        `;
    }
}

afficherPanierVide();

// si le panier n'est pas vide afficher les articles du panier

function afficherPanierPlein() {
    const panierPlein = document.querySelector(".panier");
    if (panierPlein) {
        panierPlein.innerHTML = "";
    }
}

afficherPanierPlein();

// Fonction pour afficher la modal de confirmation
function afficherModalConfirmation(numeroDeCommande) {
    const modal = document.getElementById("modal");
    const numeroCommandeSpan = document.getElementById("numero-commande");

    if (numeroCommandeSpan) {
        numeroCommandeSpan.textContent = numeroDeCommande;
    }

    modal.style.display = "block";

    // Réinitialisation des données du formulaire de commande
    document.getElementById("prenom").value = "";
    document.getElementById("nom").value = "";
    document.getElementById("adresse").value = "";
    document.getElementById("ville").value = "";
    document.getElementById("email").value = "";

    // Réinitialisation des données du panier
    localStorage.removeItem("panier"); // Supprime les données du panier du localStorage
    afficherPanier(); // Met à jour l'affichage du panier (vous devez avoir une fonction afficherPanier pour cela)
}

// Écouteur de clic pour fermer la modal
const closeButton = document.getElementById("close-modal");
closeButton.addEventListener("click", () => {
    const modal = document.getElementById("modal");
    modal.style.display = "none";
});

// Gestion de la soumission du formulaire de commande
const commandeForm = document.querySelector("form");

commandeForm.addEventListener("submit", async (e) => {
    e.preventDefault(); // Empêche l'envoi du formulaire

    // Récupérez les données du formulaire
    const firstName = document.getElementById("prenom").value;
    const lastName = document.getElementById("nom").value;
    const address = document.getElementById("adresse").value;
    const city = document.getElementById("ville").value;
    const email = document.getElementById("email").value;
    const products = JSON.parse(localStorage.getItem("panier")).map((el) => el.id);

    // Créez un objet avec les données du formulaire avec un objet contact et un tableau products
    const commandeData = {
        contact: {
            firstName,
            lastName,
            address,
            city,
            email,
        },
        products,
    };

    try {
        // Effectuez une requête POST au backend pour enregistrer la commande
        const response = await fetch("http://localhost:3000/api/products/order", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(commandeData),
        });

        if (response.ok) {
            // Si la requête est réussie, récupérez la réponse JSON (numéro de commande)
            const data = await response.json();
            const numeroDeCommande = data.orderId;

            // Affichez la modal de confirmation avec le numéro de commande
            afficherModalConfirmation(numeroDeCommande);
        } else {
            // Gérez les erreurs en affichant un message d'erreur, par exemple
            console.error("Erreur lors de la soumission du formulaire.");
        }
    } catch (error) {
        console.error("Erreur lors de la soumission du formulaire :", error);
    }
});
