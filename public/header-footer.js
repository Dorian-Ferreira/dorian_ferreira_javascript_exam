const header = `<nav class="navbar navbar-expand-lg bg-body-tertiary">
	<div class="container-fluid">
		<a class="navbar-brand" href="/">Navbar</a>
		<button
			class="navbar-toggler"
			type="button"
			data-bs-toggle="collapse"
			data-bs-target="#navbarNav"
			aria-controls="navbarNav"
			aria-expanded="false"
			aria-label="Toggle navigation">
			<span class="navbar-toggler-icon"></span>
		</button>
		<div class="collapse navbar-collapse" id="navbarNav">
			<ul class="navbar-nav">
				<li class="nav-item">
					<a
						class="nav-link active"
						aria-current="page"
						href="/">
						Accueil
					</a>
				</li>
				<li class="nav-item">
					<a class="nav-link" href="/produits">Produits</a>
				</li>
				<li class="nav-item">
					<a class="nav-link" href="/panier"><i class="fa-solid fa-cart-shopping"></i></a>
				</li>
			</ul>
		</div>
	</div>
	</nav>`;

const footer = `<div>Oui</div>`;

const headerElement = document.querySelector('header');
const footerElement = document.querySelector('footer');

headerElement.innerHTML = header;
footerElement.innerHTML = footer;
