const path = require('path');
const fs = require('fs');
const express = require('express');
const app = express();

let productsData = [];

fs.readFile('produits.json', 'utf8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }
    productsData = data;
});

// Express.js middleware to use JSON objects
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.get('/produits', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/list.html'));
});

app.get('/panier', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/panier.html'));
});

app.get('/data/produits', (req, res) => {
    res.send(productsData);
});

app.get('/produit/:id', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/details.html'));
});

app.listen(3000, () => {
    console.log('Serveur démarré sur le port 3000');
});
