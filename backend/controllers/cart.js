var express = require("express");
var db = require("../database/database");

const validators = require("../utils/validators");
const cart_service = require("../services/cart");

var router = express.Router();

const calculate_prices = cart_service.calculate_prices;

// SHOULD BE IN A SERVICE, using a proper STRATEGY PATTERN

router.post("/", async (req, res) => {
  `
    req.body deve ser um array de produtos (KISS)
    [
      {product_id , quantity}
    ]
  `;
  const errors = validators.validate_sales(req.body);

  if (errors.length > 0) {
    res.status(400).send(errors);
    return;
  }

  const products_ids = req.body.map(el => el.id_product);
  const select_products = `select * from product where id in (${products_ids.join(
    ", "
  )})`;

  // Gather products data
  db.all(select_products, (err, products) => {
    let id_promotions = {};
    products.forEach(product => {
      if (product.id_promotion && !(product.id_promotion in id_promotions)) {
        id_promotions[product.id_promotion] = true;
      }
    });

    id_promotions = Object.keys(id_promotions);

    if (id_promotions.length == 0) {
      res.send(calculate_prices(products, [], req.body));
    } else {
      const select_promotions = `select * from promotion where id in (${id_promotions.join(
        ", "
      )})`;
      db.all(select_promotions, (err, promotions) => {
        res.send(calculate_prices(products, promotions, req.body));
      });
    }
  });
});

module.exports = router;
