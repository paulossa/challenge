import alt from "../../alt";

import PromotionActions from "./PromotionActions";

class PromotionStore {
  constructor() {
    this.promotions = [];
    this.bindActions(PromotionActions);
  }

  getPromotions(promotions) {
    this.promotions = promotions;
  }
}

export default alt.createStore(PromotionStore, "promotionStore");
