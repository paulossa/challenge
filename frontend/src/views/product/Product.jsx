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
  IconButton,
  Button,
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
    query: "",
  };

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
    PromotionActions.getPromotions()
      .then(console.log(this.props))
      .catch(() => alert("Houve um erro ao buscar as promoções"));
    this.setState({ loading: false });
  };

  getProducts = async () => {
    this.setState({ loading: true });
    await ProductActions.getProducts().catch(() =>
      alert("Houve um erro ao buscar produtos")
    );
    this.setState({ loading: false });
  };

  goTo = (productId) => () => {
    this.props.history.push(RoutesConfig.productsEdit(productId));
  };

  handleDeleteButton = (productId) => async () => {
    this.setState({ loading: true });
    let usr_answer = window.confirm("Deseja realmente deletar esse produto?");
    if (usr_answer) {
      await ProductActions.deleteProduct(productId).catch((error) => {
        let msg = "Houve um erro ao deletar o produto";
        if (error.response && error.response.data.message) {
          msg = error.response.data.message;
        }
        alert(msg);
      });
    }
    this.setState({ loading: false });
  };

  renderPromotionItem = (item) => (
    <MenuItem value={item.id} key={`item_${item.id}`}>
      {item.description}
    </MenuItem>
  );

  renderProduct = (product, idx) => {
    const { promotions } = this.props;
    console.log("p ", promotions);
    return (
      <Paper className="product__item" key={`pr_${idx}`}>
        <section>
          <code title="Código do produto">Código: {product.code}</code>
          <Typography variant="title">{product.name}</Typography>
        </section>
        <section>
          <FormControl className="product__item__select">
            <InputLabel>Promoção</InputLabel>
            <Select
              value={product.id_sale || ""}
              className="product__item__select"
              inputProps={{ readOnly: true }}
            >
              <MenuItem value={""}>
                <em>Nenhuma</em>
              </MenuItem>
              {promotions.map(this.renderPromotionItem)}
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

    const query_lower = query.toLowerCase();
    const queryFilter = ({ name, identifier }) =>
      name.toLowerCase().includes(query_lower) ||
      identifier.toLowerCase().includes(query_lower);
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

  handleChange = ({ target: { name, value } }) =>
    this.setState({ [name]: value });

  render() {
    const { query } = this.state;
    return (
      <main className="product content-container">
        <section className="product__header">
          <Typography variant="h4">Lista de Produtos</Typography>
          <Button onClick={this.goTo("novo")} variant="contained">CRIAR NOVO</Button>
        </section>
        <Divider />
        <FormControl
          className="product__search"
          classes={{ root: "product__search" }}
          variant="outlined"
        >
          <InputLabel htmlFor="query">Pesquisa (Nome ou código)</InputLabel>
          <OutlinedInput
            id="query"
            value={query}
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
