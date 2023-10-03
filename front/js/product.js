
const urlOeuvre = window.location.search;
const oeuvreID = new URLSearchParams(urlOeuvre);
const ID = oeuvreID.get('id')

let data = []

async function init() {
    data = await constID()
    console.log(data)
    showdata(data, 1)
}
init()


async function constID() {
    const requete = await fetch(`http://localhost:3000/api/products/${ID}`)
    return await requete.json()
}

function showdata(data, id) {
    document.querySelector("title").innerHTML = data.titre
    document.querySelector("#image-oeuvre").src = data.image
    document.querySelector("#image-oeuvre").alt = data.titre
    document.querySelector("h1").innerHTML = data.titre
    let resume = data.description
    document.querySelector("#para").innerHTML = (resume.substring(0, 200))
    document.querySelector(".button-buy").innerHTML = `Buy ${data.shorttitle}`
    document.querySelector(".button-buy").href = `panier.html?id=${data._id}`
    document.querySelector(".button-buy").id = data._id
    document.querySelector(".button-add").innerHTML = `Add ${data.shorttitle}`
    document.querySelector(".button-add").id = data._id
}

