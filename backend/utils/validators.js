var db = require("../database/database");

const validate_product = (product = { name: "" }) => {
  // product should have at least name and price
  let errors = {};
  if (!product.name || 
    
    !product.name.trim()) {
    errors.name = "Nome não pode ser vazio";
  }

  if (!product.value || product.value < 0) {
    errors.value = "Valor deve existir e não pode ser negativo";
  }

  if (!product.code || !product.code.trim()) {
    errors.code = "Produto deve ter um código";
  }

  return errors;
};

const validate_product_schema = (req, res, next) => {
  const errors = validate_product(req.body);

  if ('id_promotion' in req.body && !req.body.id_promotion) {
    delete req.body.id_promotion
  }

  if (Object.keys(errors).length === 0) {
    next();
  } else {
    res.status(400).json(errors);
  }
};

const validate_promotion = (promotion = { type: "", description: "" }) => {
  // Promotions should have at least a type and a description
  let errors = [];

  if (!promotion.type.trim()) {
    errors.push("Tipo não pode ser vazio");
  }

  if (!promotion.description.trim()) {
    errors.push("Descrição não pode ser vazia");
  }

  return errors;
};

const validate_sales = (cart = []) => {
  if (cart instanceof Array) {
    if (cart.length > 0) {
      if (
        cart.every(
          product => Boolean(product.id_product) && product.quantity > 0
        )
      ) {
        return [];
      }
      return ["Items do carrinho devem ter {id_product, quantity: > 0}"];
    }
    return ["Carrinho não pode ser vazio"];
  }
  return ["Carrinho deve ser uma lista de objetos"];
};

module.exports = {
  validate_product,
  validate_product_schema,
  validate_promotion,
  validate_sales
};
