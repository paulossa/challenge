import alt from "../../alt";
import api from "../../global/api";

class UpsertProductActions {
  getProduct(productId) {
    return async (dispatch) => {
      try {
        const { data } = await api.get(`/products/${productId}`);
        dispatch(data);
      } catch (error) {
        throw error;
      }
    };
  }

  putProduct(product) {
    return async (dispatch) => {
      try {
        console.log('ppp ', product)
        if (product.id_sale === "") {
          delete product.id_sale;
          console.log('rrerejoreijw')
        }
        await api.put(`/products/${product.id}`, product, {
          headers: { "Content-Type": "application/json" },
        });
        dispatch();
      } catch (error) {
        throw error;
      }
    };
  }

  postProduct(product) {
    return async (dispatch) => {
      try {
        await api.post(
          `/products`, 
          product, 
          {
            headers: { "Content-Type": "application/json" },
          });
        dispatch();
      } catch (error) {
        throw error;
      }
    };
  }

  getPromotions() {
    return async (dispatch) => {
      try {
        const { data } = await api.get("/sales");
        dispatch(data);
      } catch (error) {
        throw error;
      }
    };
  }
}

export default alt.createActions(UpsertProductActions);
