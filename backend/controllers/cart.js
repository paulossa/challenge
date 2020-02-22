var express = require("express");
var db = require("../database/database");

const validators = require("../utils/validators");
const cart_service = require("../services/cart");

var router = express.Router();

// SHOULD BE IN A SERVICE, using a proper STRATEGY PATTERN

function calculate_prices(products, promotions, cart) {
  let product, promotion;
  let output = [];

  for (let cart_item of cart) {
    product = products.find(product => product.id === cart_item.id_product);
    promotion = product.id_promotion
      ? promotions.find(p => p.id === product.id_promotion)
      : null;

    if (!promotion) {
      output.push({
        code: product.code,
        name: product.name,
        value: product.value * cart_item.quantity,
        quantity: cart_item.quantity,
        promotion: null
      });
    } else {
      switch (promotion.type) {
        case "pague1leve2":
          let items_in_prom = Math.floor(cart_item.quantity / 2);
          let items_not_in_prom = cart_item.quantity % 2;

          if (items_in_prom) {
            output = [
              ...output,
              {
                code: product.code,
                name: product.name,
                value: product.value * items_in_prom,
                quantity: cart_item.quantity - items_not_in_prom,
                promotion: promotion.type
              }
            ];
          }

          if (items_not_in_prom) {
            output = [
              ...output,
              {
                code: product.code,
                name: product.name,
                value: product.value * items_not_in_prom,
                quantity: items_not_in_prom,
                promotion: null
              }
            ];
          }
          break;
        case "3por10":
          let promotion_group = Math.floor(cart_item.quantity / 3);
          let qty_not_prom = cart_item.quantity % 3;

          if (promotion_group) {
            output = [
              ...output,
              {
                code: product.code,
                name: product.name,
                value: promotion_group * 1000,
                quantity: cart_item.quantity - qty_not_prom,
                promotion: promotion.type
              }
            ];
          }
          if (qty_not_prom) {
            output = [
              ...output,
              {
                code: product.code,
                name: product.name,
                value: qty_not_prom * product.value,
                quantity: qty_not_prom,
                promotion: null
              }
            ];
          }
          break;
        default:
          break;
      }
    }
  }

  return output;
}

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
