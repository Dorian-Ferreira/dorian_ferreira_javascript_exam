const productsDiv = document.querySelector('#products');
const main = document.querySelector('main');
const prixTotal = document.querySelector('#prixTotal');
const validation = document.querySelector('#validation');

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
        validation.innerHTML = '';
        return;
    }
    productsDiv.innerHTML = '';
    validation.innerHTML = `<button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#confirmCommand">Valider la commande</button>`;

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
					<button class="btn btn-danger" onclick="editPanier(${productData.id}, true)"><i class="fa-solid fa-minus fa-xl"></i></button>
					<button class="btn btn-success" onclick="editPanier(${productData.id}, false)"><i class="fa-solid fa-plus fa-xl"></i></button>
				</div>
			</div>
            <div class="card-footer d-flex flex-column">
				<a href="/produit/${productData.id}" class="btn btn-primary mt-2">En savoir plus</a>
				<button onclick="editPanier(${productData.id})" class="btn btn-danger mt-2"><i class="fa-solid fa-trash"></i></button>
			</div>
		</div>
		`;

        productsDiv.appendChild(product);
    });
    calculPrixTotal();
}

function editPanier(produitId, remove) {
    let produit = panier.produits.find((elem) => elem.id === produitId);
    if (produit) {
        if (remove != null) {
            produit.quantity = produit.quantity + (remove === true ? -1 : 1);
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

const modal = new bootstrap.Modal(document.querySelector(".modal"));
const formCommande = document.querySelector("form");

const emailInput = document.querySelector("#emailInput");
const nameInput = document.querySelector("#nameInput");
const adressInput = document.querySelector("#adressInput");
const consentInput = document.querySelector("#consent");

if (formCommande) {
    formCommande.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = emailInput.value;
        const name = nameInput.value;
        const adress = adressInput.value;
        const consent = consentInput.value;

        emailInput.classList.remove("is-invalid");
        if(!email) {
            emailInput.classList.add("is-invalid");
        }
        
        nameInput.classList.remove("is-invalid");
        if(!name) {
            nameInput.classList.add("is-invalid");
        }
        
        adressInput.classList.remove("is-invalid");
        if(!adress) {
            adressInput.classList.add("is-invalid");
        }
        
        consentInput.classList.remove("is-invalid");
        if(!consent) {
            consentInput.classList.add("is-invalid");
        }

        if(!email || !name || !adress || !consent) {
            return;
        }

        panier.user = {
            email: email,
            name: name,
            adress: adress,
        };

        localStorage.setItem('panier', JSON.stringify(panier));
        modal.hide();
        window.location.href = "/commande/validation"
    });
}