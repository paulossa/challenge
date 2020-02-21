import alt from "../../alt";
import api from "../../global/api";

class PromotionActions {
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

export default alt.createActions(PromotionActions);
