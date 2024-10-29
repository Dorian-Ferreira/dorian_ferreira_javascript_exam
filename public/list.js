const productsDiv = document.querySelector('#products');
const searchInput = document.querySelector('#searchInput');

let products;

fetch('/data/produits')
    .then((response) => response.json())
    .then((data) => {
        products = data;
        displayData(products)
    })
    .catch((error) => console.log(error));

function displayData(data) {
    productsDiv.innerHTML = "";
    data.forEach((element) => {
        let product = document.createElement('div');

        product.innerHTML = `
		<div class="card col">
			<img src="${element.image}" class="card-img-top" alt="Image de ${element.nom_produit}">
			<div class="card-body d-flex flex-column">
				<h5 class="card-title text-center">${element.nom_produit}</h5>
				<p class="card-text text-center">${element.descriptif}</p>
				<p class="card-text text-center">${element.prix}</p>
			</div>
            <div class="card-footer d-flex flex-column">
				<a href="/produit/${element.id}" class="btn btn-primary">En savoir plus</a>
				<button onclick="ajouterPanier(${element.id})" class="btn btn-success mt-2">Ajouter au panier</button>
			</div>
		</div>
		`;

        productsDiv.appendChild(product);
    });
}

function ajouterPanier(produitId) {
    let panier = localStorage.getItem('panier');
    if (panier) {
        panier = JSON.parse(panier);
        let produit = panier.produits.find((elem) => elem.id === produitId);
        if (produit) {
            produit.quantity += 1;
        } else {
            let panierElement = { id: produitId, quantity: 1 };
            panier.produits.push(panierElement);
        }
    } else {
        panier = {
            numero: Math.floor(Math.random() * 100000),
            produits: [{ id: produitId, quantity: 1 }],
        };
    }
    localStorage.setItem('panier', JSON.stringify(panier));

    alert('Le produit a été rajouté au panier.');
}

searchInput.addEventListener("input", (event) => {
    displayData(filterByName(searchInput.value));
})

function filterByName(name) {
    if(!name) {
        return products;
    } else {
        return products.filter((element) => element.nom_produit.toLowerCase().includes(name.toLowerCase()));
    }
}

const rangeInput = document.querySelectorAll(".range-input input");
const priceInput = document.querySelectorAll(".price-input input");
const range = document.querySelector(".slider .progress");
let priceGap = 100;

priceInput[0].value = 0;
priceInput[1].value = 5000;

rangeInput[0].value = 0;
rangeInput[1].value = 5000;

priceInput.forEach((input) => {
    input.addEventListener("input", (e) => {
        let minPrice = parseInt(priceInput[0].value);
        let maxPrice = parseInt(priceInput[1].value);

        if (maxPrice - minPrice >= priceGap && maxPrice <= rangeInput[1].max) {
            if (e.target.className === "input-min") {
                rangeInput[0].value = minPrice;
                range.style.left = (minPrice / rangeInput[0].max) * 100 + "%";
            } else {
                rangeInput[1].value = maxPrice;
                range.style.right = 100 - (maxPrice / rangeInput[1].max) * 100 + "%";
            }
        }
        priceInput[0].max = parseInt(priceInput[1].value) - priceGap;
        priceInput[1].min = parseInt(priceInput[0].value) + priceGap;

        displayData(filterByName(searchInput.value).filter((element) => parseFloat(element.prix) >= minPrice && parseFloat(element.prix) <= maxPrice));
    });
});

rangeInput.forEach((input) => {
    input.addEventListener("input", (e) => {
        let minVal = parseInt(rangeInput[0].value);
        let maxVal = parseInt(rangeInput[1].value);

        if (maxVal - minVal < priceGap) {
            if (e.target.className === "range-min") {
                rangeInput[0].value = maxVal - priceGap;
            } else {
                rangeInput[1].value = minVal + priceGap;
            }
        } else {
            priceInput[0].value = minVal;
            priceInput[1].value = maxVal;
            range.style.left = (minVal / rangeInput[0].max) * 100 + "%";
            range.style.right = 100 - (maxVal / rangeInput[1].max) * 100 + "%";
        }

        displayData(filterByName(searchInput.value).filter((element) => parseFloat(element.prix) >= minVal && parseFloat(element.prix) <= maxVal));
    });
});
