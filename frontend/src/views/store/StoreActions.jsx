import alt from "../../alt";
import api from "../../global/api";

class StoreActions {
  getProducts() {
    return async dispatch => {
      try {
        const { data } = await api.get("/produto");
        dispatch(data);
      } catch (err) {
        throw err;
      }
    };
  }

  checkout(cart) {
    return async dispatch => {
      try {
        const { data } = await api.post("/carrinho", cart);
        dispatch(data);
      } catch (error) {
        throw error;
      }
    };
  }

  removeFromProducts(product) {
    return product;
  }

  addToProducts(product) {
    return product;
  }
}

export default alt.createActions(StoreActions);
