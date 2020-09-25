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
    this.bankslipTotal = 0;
    this.promotions = {};
    this.bindActions(StoreActions);
  }

  getProducts(products) {
    this.products = products;
  }

  checkout({bankslip, bankslip_total}) {
    this.bankslip = bankslip;
    this.bankslipTotal = bankslip_total;
  }

  getPromotions(promotions) {
    let temp_prom = {};
    for (const promotion of promotions) {
      temp_prom[promotion.id] = `${promotion.description}`;
    }
    this.promotions = temp_prom;
  }

  removeFromProducts(product) {
    this.products = this.products.filter(p => p.id !== product.id);
  }

  addToProducts(product) {
    this.products = [...this.products, product];
  }
}

export default alt.createStore(StoreStore, "StoreStore");
