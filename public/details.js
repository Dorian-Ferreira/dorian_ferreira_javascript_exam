const title = document.querySelector('h1');
const titleModal = document.querySelector('h2');
const images = document.querySelectorAll('img');
const details = document.querySelector('#details');

let element;

fetch('/data/produits')
    .then((response) => response.json())
    .then((data) =>
        displayData(
            data.find(
                (element) =>
                    element.id == window.location.pathname.split('/').at(-1)
            )
        )
    )
    .catch((error) => console.log(error));

function displayData(data) {
    element = data;
    
    document.title = element.nom_produit;

    title.innerHTML = element.nom_produit;
    titleModal.innerHTML = element.nom_produit;

    images.forEach((image) => {
        image.src = '../' + element.image;
        image.alt = 'Image pour ' + element.nom_produit;
    });

    details.innerHTML = `
	<p>${element.descriptif}</p>
	<span>Caractéristiques : </span>
	<ul class="list-group">
		<li class="list-group-item">${element.caracteristiques.résolution}</li>
		<li class="list-group-item">${element.caracteristiques.zoom}</li>
		<li class="list-group-item">${element.caracteristiques.connectivité}</li>
		<li class="list-group-item">${element.caracteristiques.écran}</li>
	</ul>
	<p>Prix : ${element.prix}</p>
	<button onclick="ajouterPanier()" class="btn btn-primary">Ajouter au panier</button>
	`;
}

function ajouterPanier() {
    let panier = localStorage.getItem('panier');
    if (panier) {
        panier = JSON.parse(panier);
        let produit = panier.produits.find((elem) => elem.id === element.id);
        if (produit) {
            produit.quantity += 1;
        } else {
            let panierElement = { id: element.id, quantity: 1 };
            panier.produits.push(panierElement);
        }
    } else {
        panier = {
            numero: Math.floor(Math.random() * 100000),
            produits: [{ id: element.id, quantity: 1 }],
        };
    }
    localStorage.setItem('panier', JSON.stringify(panier));

    alert('Le produit a été rajouté au panier.');
}
