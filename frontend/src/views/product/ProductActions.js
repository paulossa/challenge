import alt from "../../alt";
import api from "../../global/api";

class NewActions {
  getProducts() {
    return async dispatch => {
      try {
        const { data } = await api.get('/products');
        dispatch(data);
      } catch (err) {
        throw err;
      }
    };
  }

  editProduct(product) {
    return async dispatch => {
      try {
        await api.put(`/products/${product.id}`, product)
        dispatch(product);
      } catch (err) {
        throw err;
      }
    }
  }

  deleteProduct(productId) {
    return async dispatch => {
      try {
        await api.delete(`/products/${productId}`);
        dispatch(productId);
      } catch (err) {
        throw err;
      }
    }
  }
}

export default alt.createActions(NewActions);
