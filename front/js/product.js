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
        select.innerHTML += `<option data-id="${index}" value="${el.taille}">Format : ${el.taille}</option>`
    });

    document.querySelector('.showprice').innerHTML = `${data.declinaisons[0].prix}€`

    return data;
}

function populate(datas) {
    const select = document.querySelector("select")
    select.addEventListener('change', () => {
        const format = document.querySelector('#format')
        const id = format.options[format.selectedIndex].dataset.id
        document.querySelector('.showprice').innerHTML = datas.declinaisons[id].prix + ' €'
    })
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
console.log(datas)
const quantite = document.querySelector("input").value
const format = document.querySelector('#format').value;
const produit = {
    id: datas._id,
    titre: datas.titre,
    image: datas.image,
    quantite:quantite,
    format: format
};
    ajouterAuPanier(produit, quantite, format);

    let panier = localStorage.getItem("panier");
    if (panier === null) {
        panier = [];
    } else {
        panier = JSON.parse(panier);
    }
    
    // panier.push(datas);
    
    localStorage.setItem("panier", JSON.stringify(panier));
    
    document.querySelector(".modal").style.display = "flex";
    document.querySelector(".modal").innerHTML = `
    <div class="modal-content">
        <p>Produit ajouté au panier !</p>
        <a href="cart.html">Voir le panier</a>
        <button class="close-modal">Fermer</button>
    </div>
    `;
    
    const modal = document.querySelector(".close-modal");
    modal.addEventListener("click", () => {
        document.querySelector(".modal").style.display = "none";
    });
});


function ajouterAuPanier(produit, quantite, format) {

    let panier = localStorage.getItem("panier");
    panier = panier ? JSON.parse(panier) : [];

    const produitExistant = panier.find(item => item.id === produit.id && item.format === format);

    if (produitExistant) {
        produitExistant.quantite += parseInt(quantite);
    } else {
        panier.push({ id: produit.id, quantite: parseInt(quantite), format: format, produit });
    }

    localStorage.setItem("panier", JSON.stringify(panier));
}
