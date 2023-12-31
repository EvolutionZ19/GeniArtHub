const urlOeuvre = window.location.search;
const oeuvreID = new URLSearchParams(urlOeuvre);
const ID = oeuvreID.get('id');

let datas = null;

async function init() {
    datas = await constID();
    populate(datas);
    details(datas);
}

init();

async function constID() {
    const req = await fetch(`http://localhost:3000/api/products/${ID}`);
    const data = await req.json();

    const select = document.querySelector("select");
    data.declinaisons.forEach((el, index) => {
        select.innerHTML += `<option data-id="${index}" value="${el.taille}">Format : ${el.taille}</option>`;
    });

    document.querySelector('.showprice').innerHTML = `${data.declinaisons[0].prix}€`;

    return data;
}

function populate(datas) {
    const select = document.querySelector("select");
    select.addEventListener('change', () => {
        const format = document.querySelector('#format');
        const id = format.options[format.selectedIndex].dataset.id;
        document.querySelector('.showprice').innerHTML = datas.declinaisons[id].prix + ' €';
    });
}

function details(data) {
    document.querySelector("title").innerHTML = data.titre;
    document.querySelector("#image-oeuvre").src = data.image;
    document.querySelector("#image-oeuvre").alt = data.titre;
    document.querySelector("h1").innerHTML = data.titre;
    let resume = data.description;
    document.querySelector("#para").innerHTML = resume.substring(0, 200);
    document.querySelector(".button-buy").innerHTML = `Acheter ${data.shorttitle}`;
    document.querySelector(".button-buy").href = `cart.html?id=${data._id}`;
    document.querySelector(".button-buy").id = data._id;
}

const boutonAcheter = document.querySelector(".button-buy");

boutonAcheter.addEventListener("click", (e) => {
    e.preventDefault();
    const quantiteInput = document.querySelector("input");
    const quantite = parseInt(quantiteInput.value);
    const format = document.querySelector('#format').value;

    if (quantite >= 1) {

        const produit = {
            id: datas._id,
            titre: datas.titre,
            image: datas.image,
            quantite: quantite,
            format: format
        };
        if (quantite > 100) {
            showModal("100 exemplaires max !");
        } else {
            ajouterAuPanier(produit, quantite, format);
        }
    } else {
       showModal("la quantité ne peut être en négatif !!");
    }
});

let panier = localStorage.getItem("panier");
if (panier === null) {
    panier = [];
} else {
    panier = JSON.parse(panier);
}

localStorage.setItem("panier", JSON.stringify(panier));
numberItem();

document.querySelector(".modal").style.display = "flex";
document.querySelector(".modal").innerHTML = `
    <div class="modal-contenue">
        <p>Produit ajouté au panier !</p>
        <a href="cart.html">Voir le panier</a>
        <button class="bouton-modal">Fermer</button>
    </div>
`;

const modal = document.querySelector(".bouton-modal");
modal.addEventListener("click", () => {
    modal.style.display = "none";
});

function ajouterAuPanier(produit, quantite, format) {
    let panier = localStorage.getItem("panier");
    panier = panier ? JSON.parse(panier) : [];

    const produitExistant = panier.find(item => item.id === produit.id && item.format === format);

    if (produitExistant) {
        if (produitExistant.quantite + parseInt(quantite) > 100) {
            showModal("100 exemplaire max.");
        } else {
            produitExistant.quantite += parseInt(quantite); 
        }
    } else {
        if (parseInt(quantite) > 100) {
            showModal("Limitation d'achat 100 par produits");
        }
 
         else {
            panier.push({ id: produit.id, quantite: parseInt(quantite), format });
            showModal("produit ajouté au panier")
        }
    }

    localStorage.setItem("panier", JSON.stringify(panier));
    numberItem();
}

function showModal(message){

    const modal = document.createElement('dialog')
    modal.textContent = message
    document.body.appendChild(modal)
    modal.showModal()
    setTimeout(() =>{
        modal.close()
        modal.remove()
    },3000)
}