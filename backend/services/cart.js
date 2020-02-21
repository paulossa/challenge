const db = require("../database/database");
var constants = require('../database/constants');

function calculate_value_product(product, quantity, promotion) {
  if (promotion) {
    switch (promotion.type) {
      case "2":
        break;

      default:
        break;
    }
  }
  // Default case 
  return [[{product: product, quantity: quantity}], product.value * quantity];
}

module.exports = {
  calculate: async (cart_items = [], callback=()=>{}) => { 
    const products_ids = cart_items.map(item => item.id_product);
    const sql_get_products = `select * from product where id in (${products_ids.join(', ')})`;
    db.all(sql_get_products, [], (err, data) => {
      callback(data);
    })


  },
  calcultate_prices: console.log,
  calculate2: async (cart_items = []) => {







    let output = { products: [], total: 0 };
    const sql_get_product = `select * from product where id = ?`;
    const sql_get_promotion = 'select * from promotion where id = ?';

    db.open(constants.DB_PATH);

    console.log(await db.all(sql_get_product, [cart_item.id_product]));

    for (let cart_item of cart_items) {
      db.all(sql_get_product, [cart_item.id_product], (err, product) => {
        
        db.all(sql_get_promotion, [product.id_promotion], (err, promotion) => {
          promotion = promotion.length == 1 ? promotion[0] : {};
          let [charged_products, total] = calculate_value_product(
            product[0],
            cart_item.quantity,
            promotion
          );
          console.log('should alter products',  calculate_value_product(
            product[0],
            cart_item.quantity,
            promotion
          ), charged_products, total)
          output.products = [...output.products, charged_products];
          output.total += total;
        })
      });
    }

    console.log('after for')

    return output;
  },
};
