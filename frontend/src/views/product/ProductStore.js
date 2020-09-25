import alt from "../../alt";

import ProductActions from "./ProductActions";
class ProductStore {
  constructor() {
    this.products = [];
    this.bindActions(ProductActions);
  }

  getProducts(products) {
    const normalizeCurrency = p => ({ ...p, value: p.value });
    this.products = products.map(normalizeCurrency);
  }

  deleteProduct(productId) {
    this.products = this.products.filter(prod => prod.id !== productId)
  }
}

export default alt.createStore(ProductStore, "ProductStore");
