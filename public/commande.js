const productsDiv = document.querySelector('#products');
const main = document.querySelector('main');
const prixTotal = document.querySelector('#prixTotal');
const name = document.querySelector('#name');
const adress = document.querySelector('#adress');
const email = document.querySelector('#email');

const panierLocalStorage = localStorage.getItem('panier');

const panier = JSON.parse(panierLocalStorage);
const commandes = JSON.parse(localStorage.getItem("commandes")) || [];
commandes.push(panierLocalStorage);
localStorage.setItem("commandes", JSON.stringify(commandes));
localStorage.removeItem('panier');

let products;

fetch('/data/produits')
    .then((response) => response.json())
    .then((data) => display(data))
    .catch((error) => console.log(error));

function display(data) {
    products = data;

    panier.produits.forEach((element) => {
        let product = document.createElement('div');

        let productData = data.find((elem) => elem.id === element.id);

        product.innerHTML = `
		<div class="card col" id="card-${productData.id}">
			<img src="../${productData.image}" class="card-img-top" alt="Image de ${productData.nom_produit}">
			<div class="card-body d-flex flex-column">
				<h5 class="card-title text-center">${productData.nom_produit}</h5>
				<div class="d-flex justify-content-evenly align-items-center">
					<div class="card-text">${productData.prix}</div>
					<div class="card-text">${element.quantity}</div>
				</div>
				<a href="/produit/${productData.id}" class="btn btn-primary mt-2">En savoir plus</a>
			</div>
		</div>
		`;

        productsDiv.appendChild(product);
    });
    calculPrixTotal();
    email.innerHTML = `Email : ${panier.user.email}`;
    adress.innerHTML = `Adresse : ${panier.user.adress}`;
    name.innerHTML = `Name : ${panier.user.name}`;
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
