import React, { Component } from "react";
import connectToStores from "alt-utils/lib/connectToStores";

import SearchIcon from '@material-ui/icons/SearchRounded';
import Typography from "@material-ui/core/Typography";




import ProductActions from "./ProductActions";
import ProductStore from "./ProductStore";
import { Paper, FormControl, InputLabel, OutlinedInput, Divider, Select, MenuItem } from "@material-ui/core";

import './Product.css';

class Product extends Component {
  state = {
    loading: true,
    query: "",
  };

  inputLabel = React.createRef();

  static getPropsFromStores() {
    return ProductStore.getState();
  }

  static getStores() {
    return [ProductStore];
  }

  componentDidMount() {
    this.getProducts();
  }

  getProducts = async () => {
    this.setState({ loading: true });
    try {
      await ProductActions.getProducts();
    } catch (error) {
      console.error(error)
      let msg = 'Houve um erro ao buscar produtos'
      if (error.response && error.response.data.message) {
        msg = error.response.data.message
      }
      alert(msg);
    }

    this.setState({ loading: false });
  };

  addPromotionToProduct = (idx, productId) => evt => {
    // TODO change props.products, add id_promotion inside it. set flag edited = true? 
  }

  renderProduct = (product, idx) => {
    return (
      <Paper className="product__item" key={`pr_${idx}`}>
        <section>
          <Typography variant="title">{product.name}</Typography>
          <Typography variant="subtitle1">{product.description}</Typography>
        </section>
        <section>
          <FormControl >
              <InputLabel id="product__item__select">
                Promoção
              </InputLabel>
              <Select 
                value={product.id_promotion} 
                onChange={this.addPromotionToProduct(idx, product.id)}
                id="product__item__select"
                className="product__item__select"
              >
                <MenuItem value={null}><em>Nenhuma</em></MenuItem>
                <MenuItem value="pague1leve2">pague1leve2</MenuItem>
                <MenuItem value="3por10">3por10</MenuItem>
              </Select>
          </FormControl>
        </section>
        <section>
          <Typography variant="h4">{product.value}</Typography>
        </section>
        <section>
          { product.edited ? 'butoes de salvar' : null}
        </section>
      </Paper>
    );
  };

  renderProducts = () => {
    const { products } = this.props;

    return (
      <section className="products__container">
        {
          products.length === 0 ? (
            <Typography variant="h5" className="centered">Nenhum produto para mostrar</Typography>
          ) : (
              products.map(this.renderProduct)
            )}
      </section>
    );
  };

  handleChange = evt => (evt) => this.setState({ [evt.target.name]: evt.target.value })

  render() {
    return (
      <main className="product content-container">
        <Typography variant="h4">Lista de Produtos</Typography>
        <Divider classes={{root: "product__divider"}}/>
        <FormControl className="product__search" classes={{ root: 'product__search' }} variant="outlined">
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
