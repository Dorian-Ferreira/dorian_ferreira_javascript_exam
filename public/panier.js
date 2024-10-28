const productsDiv = document.querySelector('#products');
const main = document.querySelector('main');
const prixTotal = document.querySelector('#prixTotal');

const panierLocalStorage = localStorage.getItem('panier');

const panier = JSON.parse(panierLocalStorage);

let products;

fetch('/data/produits')
    .then((response) => response.json())
    .then((data) => display(data))
    .catch((error) => console.log(error));

function display(data) {
    if (!panierLocalStorage || panier.produits.length === 0) {
        productsDiv.innerHTML = 'Votre panier est vide!';
        return;
    }
    productsDiv.innerHTML = '';

    products = data;

    panier.produits.forEach((element) => {
        let product = document.createElement('div');

        let productData = data.find((elem) => elem.id === element.id);

        product.innerHTML = `
		<div class="card col" id="card-${productData.id}">
			<img src="${productData.image}" class="card-img-top" alt="Image de ${productData.nom_produit}">
			<div class="card-body d-flex flex-column">
				<h5 class="card-title text-center">${productData.nom_produit}</h5>
				<div class="d-flex justify-content-evenly align-items-center">
					<div class="card-text">${productData.prix}</div>
					<div class="card-text">${element.quantity}</div>
					<button class="btn btn-danger" onclick="retirerPanier(${productData.id}, 1)"><i class="fa-solid fa-minus fa-xl"></i></button>
					
				</div>
				<a href="/produit/${productData.id}" class="btn btn-primary mt-2">En savoir plus</a>
				<button onclick="retirerPanier(${productData.id})" class="btn btn-danger mt-2"><i class="fa-solid fa-trash"></i></button>
			</div>
		</div>
		`;

        productsDiv.appendChild(product);
    });
    calculPrixTotal();
}

function retirerPanier(produitId, nb) {
    let produit = panier.produits.find((elem) => elem.id === produitId);
    if (produit) {
        if (nb) {
            produit.quantity--;
        } else {
            produit.quantity = 0;
        }
        if (produit.quantity <= 0) {
            panier.produits.splice(panier.produits.indexOf(produit), 1);
        }
    }

    localStorage.setItem('panier', JSON.stringify(panier));

    if (produit.quantity <= 0) {
        document.querySelector('#card-' + produit.id).remove();
        alert('Le produit a été retiré du panier.');
    } else {
        alert('La quantité de ce produit a été modifié.');
    }
    display(products);
    calculPrixTotal();
}

function calculPrixTotal() {
    if (panier.produits.length === 0) {
        productsDiv.innerHTML = 'Votre panier est vide!';
        prixTotal.innerHTML = '';
        return;
    }

    prixTotal.innerHTML = `Prix Total : ${
        Math.round(
            panier.produits.reduce(
                (sum, val) =>
                    sum +
                    parseFloat(
                        products.find((elem) => elem.id === val.id).prix
                    ) *
                        val.quantity,
                0
            ) * 100
        ) / 100
    } €`;
}
