import alt from "../../alt";
import api from "../../global/api";
import Axios from "axios";

class NewActions {
  getProducts() {
    return async dispatch => {
      try {
        console.log('before api call')
        const { data: data2 } = await Axios.get('http://localhost:8000/produto'); 
        console.log(data2)

        const { data } = await api.get("/produto");
        dispatch(data);
      } catch (err) {
        throw err;
      }
    };
  }
}

export default alt.createActions(NewActions);
