import alt from "../../alt";
import StoreActions from "./StoreActions";

let normalizeValue = product => ({
  ...product,
  value: product.value / 100
});

class StoreStore {
  constructor() {
    this.products = [];
    this.bankslip = [];
    this.bindActions(StoreActions);
  }

  getProducts(products) {
    this.products = products.map(normalizeValue);
  }

  checkout(bankslip) {
    this.bankslip = bankslip.map(normalizeValue);
  }

  removeFromProducts(product) {
    this.products = this.products.filter(p => p.id !== product.id);
  }

  addToProducts(product) {
    this.products = [...this.products, product];
  }
}

export default alt.createStore(StoreStore, "StoreStore");
