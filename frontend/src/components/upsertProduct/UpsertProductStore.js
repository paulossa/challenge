import alt from "../../alt";

import UpsertProductActions from "./UpsertProductActions";

class UpsertProductStore {
  constructor() {
    this.product = {};
    this.promotions = [];
    this.bindActions(UpsertProductActions);
  }

  getProduct(product) {
    console.log('changin product ')
    this.product = product;
  }

  getPromotions(promotions) {
    this.promotions = promotions;
  }
}

export default alt.createStore(UpsertProductStore, "UpsertProductStore");
