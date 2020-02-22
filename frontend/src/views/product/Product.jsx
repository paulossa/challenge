import React, { Component } from "react";
import connectToStores from "alt-utils/lib/connectToStores";

import EditIcon from "@material-ui/icons/EditRounded";
import DeleteIcon from "@material-ui/icons/DeleteForeverRounded";

import SearchIcon from "@material-ui/icons/SearchRounded";
import Typography from "@material-ui/core/Typography";

import ProductActions from "./ProductActions";
import ProductStore from "./ProductStore";
import {
  Paper,
  FormControl,
  InputLabel,
  OutlinedInput,
  Divider,
  Select,
  MenuItem,
  IconButton
} from "@material-ui/core";

import PromotionActions from "../promotion/PromotionActions";
import PromotionStore from "../promotion/PromotionStore";

import { formatCurrency } from "../../global/utils";

import "./Product.css";
import RoutesConfig from "../../RoutesConfig";
import alt from "../../alt";

class Product extends Component {
  state = {
    loading: true,
    query: ""
  };

  inputLabel = React.createRef();

  static getPropsFromStores() {
    return { ...ProductStore.getState(), ...PromotionStore.getState() };
  }

  static getStores() {
    return [ProductStore, PromotionStore];
  }

  componentDidMount() {
    this.getProducts();
    this.getPromotions();
  }

  componentWillUnmount() {
    alt.recycle(ProductStore, PromotionStore);
  }

  getPromotions = async () => {
    this.setState({ loading: true });
    try {
      await PromotionActions.getPromotions();
    } catch (err) {
      alert("Houve um erro ao buscar as promoções");
    }

    this.setState({ loading: false });
  };

  getProducts = async () => {
    this.setState({ loading: true });
    try {
      await ProductActions.getProducts();
    } catch (error) {
      console.error(error);
      let msg = "Houve um erro ao buscar produtos";
      if (error.response && error.response.data.message) {
        msg = error.response.data.message;
      }
      alert(msg);
    }

    this.setState({ loading: false });
  };

  goTo = productId => () => {
    this.props.history.push(RoutesConfig.productsEdit(productId));
  };

  handleDeleteButton = productId => async () => {
    this.setState({ loading: true });
    let usr_answer = window.confirm("Deseja realmente deletar esse produto?");
    try {
      if (usr_answer) {
        await ProductActions.deleteProduct(productId);
      }
    } catch (error) {
      let msg = "Houve um erro ao deletar o produto";

      if (error.response && error.response.data.message) {
        msg = error.response.data.message;
      }

      alert(msg);
    }
    this.setState({ loading: false });
  };

  renderPromotionItems = productId =>
    this.props.promotions.map(promotion => {
      return (
        <MenuItem value={promotion.id} key={`${productId}_${promotion.id}`}>
          {promotion.type}
        </MenuItem>
      );
    });

  renderProduct = (product, idx) => {
    return (
      <Paper className="product__item" key={`pr_${idx}`}>
        <section>
          <Typography variant="title">
            <code title="Código do produto">{product.code} | </code>
            {product.name}
          </Typography>
          <Typography variant="subtitle1">{product.description}</Typography>
        </section>
        <section>
          <FormControl className="product__item__select">
            <InputLabel>Promoção</InputLabel>
            <Select
              value={product.id_promotion || ""}
              className="product__item__select"
              inputProps={{ readOnly: true }}
            >
              <MenuItem value={""}>
                <em>Nenhuma</em>
              </MenuItem>
              {this.renderPromotionItems(product.id)}
            </Select>
          </FormControl>
        </section>
        <section>
          <Typography variant="h5">{formatCurrency(product.value)}</Typography>
        </section>
        <section className="product__item__links">
          <IconButton title="Editar" onClick={this.goTo(product.id)}>
            <EditIcon className="product__item__links--edit" />
          </IconButton>
          <IconButton
            title="Deletar"
            onClick={this.handleDeleteButton(product.id)}
          >
            <DeleteIcon className="product__item__links--delete" />
          </IconButton>
        </section>
      </Paper>
    );
  };

  renderProducts = () => {
    const { products } = this.props;
    const { query } = this.state;

    const query_lower = query.toLocaleLowerCase();
    const queryFilter = ({ name, code }) =>
      name.toLowerCase().includes(query_lower) ||
      code.toLowerCase().includes(query_lower);
    const filteredProducts = products.filter(queryFilter);
    const products_exist = filteredProducts.length > 0;

    return (
      <section className="products__container">
        {!products_exist ? (
          <Typography variant="h5" className="centered">
            Nenhum produto para mostrar
          </Typography>
        ) : (
          filteredProducts.map(this.renderProduct)
        )}
      </section>
    );
  };

  handleChange = evt => this.setState({ [evt.target.name]: evt.target.value });

  render() {
    return (
      <main className="product content-container">
        <Typography variant="h4">Lista de Produtos</Typography>
        <Divider />
        <FormControl
          className="product__search"
          classes={{ root: "product__search" }}
          variant="outlined"
        >
          <InputLabel htmlFor="query">Pesquisa (Nome ou código)</InputLabel>
          <OutlinedInput
            id="query"
            value={this.state.query}
            name="query"
            onChange={this.handleChange}
            startAdornment={<SearchIcon />}
            labelWidth={200}
          />
        </FormControl>

        {this.renderProducts()}
      </main>
    );
  }
}

export default connectToStores(Product);
