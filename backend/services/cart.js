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

module.exports = {
  calculate_prices
};
