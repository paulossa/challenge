import alt from "../../alt";
import api from "../../global/api";

class UpsertProductActions {
  getProduct(productId) {
    return async dispatch => {
      try {
        const { data } = await api.get("/produto");
        console.log('on server')
        const product = data.find(el => el.id === +productId);
        console.log('found ', product)
        dispatch(product);
      } catch (error) {
        throw error;
      }
    };
  }

  putProduct(product) {
    return async dispatch => {
      try {
        await api.put(`/produto/${product.id}`, product); 
        dispatch()
      } catch (error) {
        throw error
      }
    }
  }

  postProduct(product) { 
    return async dispatch => {
      try {
        await api.post(`/produto`, product)
        dispatch()
      } catch (error) {
        throw error;
      }
    }
  }



  getPromotions() {
    return async dispatch => {
      try {
        const { data } = await api.get("/promocao");
        dispatch(data)
      } catch (error) {
        throw error;
      }
    };
  }
}


export default alt.createActions(UpsertProductActions);
