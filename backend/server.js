var express = require("express");
var app = express();

require('dotenv').config()

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Allow CORS
app.use((req, res, next) => {
  // BE PERMISSIVE 
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', '*');
  res.header('Access-Control-Allow-Headers', '*');
  next();
});

// Controllers
var product_controller = require("./controllers/product");
var promotions_controller = require("./controllers/promotions");
var cart_controller = require("./controllers/cart")

app.use("/produto", product_controller);
app.use("/promocao", promotions_controller);
app.use("/carrinho", cart_controller);

// Default response for any other request
app.use(function(req, res) {
  res.status(404).send({message: 'Página não encontrada'});
});

var HTTP_PORT = 8000;
app.listen(HTTP_PORT, () => console.log(`Server running on port ${HTTP_PORT}`));


module.exports = app;