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

    
    const select = document.querySelector("select")
    data.declinaisons.forEach((el, index) => {
       
        select.innerHTML += `<option data-id="${index}" value="${el.taille}">Format : ${el.taille}</option>`
    })

    document.querySelector('.showprice').innerHTML = `${data.declinaisons[0].prix}€`

    return data
   }

function populate(datas){
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
    document.querySelector(".button-buy").innerHTML = `Buy ${data.shorttitle}`;
    document.querySelector(".button-buy").href = `panier.html?id=${data._id}`;
    document.querySelector(".button-buy").id = data._id;
}
