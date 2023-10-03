
let data = []

async function init() {
    data = await result()
    Tableau(data, 1)
}

init()

async function result() {
    const requete = await fetch('http://localhost:3000/api/products/')
    return await requete.json()
}

function Tableau(data) {
    for (let i = 0; i < data.length; i++) {
        document.querySelector(".products").innerHTML += `
            <article>
                <img src="${data[i].image}" alt="${data[i].name}">
                <a href="product.html?id=${data[i]._id}">
                    Buy ${data[i].shorttitle}
                </a>
            </article>
        `;
    }
}