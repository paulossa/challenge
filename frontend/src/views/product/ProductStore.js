import alt from "../../alt";

import ProductActions from './ProductActions';
class ProductStore {
  constructor() {
    this.products = [];
    this.bindActions(ProductActions);
  }

  getProducts(products) {
    this.products = products;
  }
}

export default alt.createStore(ProductStore, "ProductStore");
