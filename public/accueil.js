const productsDiv = document.querySelector('#products');

fetch('/data/produits')
    .then((response) => response.json())
    .then((data) => displayData(data))
    .catch((error) => console.log(error));

function displayData(data) {
    data.sort(() => Math.random() - Math.random()).slice(0, 6).forEach((element) => {
        let product = document.createElement('div');

        product.innerHTML = `
		<div class="card col">
			<img src="${element.image}" class="card-img-top" alt="Image de ${element.nom_produit}">
			<div class="card-body d-flex flex-column">
				<h5 class="card-title text-center">${element.nom_produit}</h5>
				<p class="card-text text-center">${element.descriptif}</p>
				<p class="card-text text-center">${element.prix}</p>
				<a href="/produit/${element.id}" class="btn btn-primary">En savoir plus</a>
				<button onclick="ajouterPanier(${element.id})" class="btn btn-primary mt-2">Ajouter au panier</button>
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
