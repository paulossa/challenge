import alt from "../../alt";

import ProductActions from "./ProductActions";
class ProductStore {
  constructor() {
    this.products = [];
    this.bindActions(ProductActions);
  }

  getProducts(products) {
    const normalizeCurrency = p => ({ ...p, value: p.value / 100 });
    this.products = products.map(normalizeCurrency);
  }
}

export default alt.createStore(ProductStore, "ProductStore");
