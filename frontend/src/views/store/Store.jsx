import React, { Component } from "react";
import connectToStores from "alt-utils/lib/connectToStores";

import alt from "../../alt";

import {
  Typography,
  Divider,
  Paper,
  IconButton,
  Input,
  Button,
  Tooltip,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Tab,
} from "@material-ui/core";

import InfoIcon from "@material-ui/icons/InfoRounded";
import AddShoppingCartIcon from "@material-ui/icons/AddShoppingCartRounded";
import RemoveShoppingCartIcon from "@material-ui/icons/RemoveShoppingCartRounded";

import { formatCurrency } from "../../global/utils";

import StoreStore from "./StoreStore";
import StoreActions from "./StoreActions";
import "./Store.css";

class StoreView extends Component {
  state = {
    cart: [],
    quantities: {},
  };

  static getPropsFromStores() {
    return StoreStore.getState();
  }

  static getStores() {
    return [StoreStore];
  }

  componentDidMount() {
    this.checkout();
    this.getProducts();
    this.getPromotions();
  }

  componentWillUnmount() {
    alt.recycle(StoreStore);
  }

  getProducts = async () => {
    this.setState({ loading: true });
    try {
      await StoreActions.getProducts();
    } catch (error) {}
    StoreActions.getProducts();

    this.setState({ loading: false });
  };

  getPromotions = async () => {
    try {
      await StoreActions.getPromotions();
    } catch (error) {
      alert("Ocorreu um erro ao buscar as promoções");
    }
  };

  checkout = async () => {
    const { cart, quantities } = this.state;
    // let payload = [{ id_product: 2, quantity: 3 }];
    let payload = [];
    for (const item of cart) {
      const qty = quantities[item.id];
      payload.push({
        id_product: item.id,
        quantity: Math.max(qty, -qty),
      });
    }
    await StoreActions.checkout(payload);
  };

  handleQuantityChange = (productId) => ({ target: { value } }) => {
    this.setState({
      quantities: { ...this.state.quantities, [productId]: value },
    });
  };

  handleAddToCart = (productId) => () => {
    const { quantities, cart } = this.state;

    if (Object.keys(quantities).includes(`${productId}`)) {
      let product = this.props.products.find((p) => p.id === productId);
      this.setState({ cart: [...cart, product] }, () => {
        StoreActions.removeFromProducts(product);
      });
    } else {
      alert("Selecione uma quantidade válida");
    }
  };

  handleRemoveFromCart = (productId) => () => {
    const { quantities, cart } = this.state;
    let new_quantities = {};
    for (const k of Object.keys(quantities)) {
      if (k !== productId) {
        new_quantities[k] = quantities[k];
      }
    }

    const product = cart.find((el) => el.id === productId);

    this.setState(
      {
        quantities: new_quantities,
        cart: cart.filter(({ id }) => id !== productId),
      },
      () => {
        StoreActions.addToProducts(product);
      }
    );
  };

  renderProducts = () => {
    const { products, promotions } = this.props;
    return products.map(({ id: productId, name, value, id_sale }) => {
      return (
        <Paper className="store__product" key={`p_${productId}`}>
          <section className="info">
            {id_sale && (
              <Tooltip
                title={
                  <Typography color="inherit">
                    Promoção: {promotions[id_sale]}
                  </Typography>
                }
                placement="top"
                arrow
              >
                <InfoIcon className="store__icon--info" />
              </Tooltip>
            )}
            <Typography variant="title">{name}</Typography>
          </section>
          <section>{formatCurrency(value)}</section>
          <section>
            <Input
              type="number"
              inputProps={{ min: "1" }}
              placeholder="Qtde"
              className="store__product__input"
              name="quantity"
              onChange={this.handleQuantityChange(productId)}
            />
            <IconButton onClick={this.handleAddToCart(productId)}>
              <AddShoppingCartIcon />
            </IconButton>
          </section>
        </Paper>
      );
    });
  };

  renderCart = () => {
    const { promotions } = this.props;
    const { quantities, cart } = this.state;

    return cart.map(({ id: productId, name, description, value, id_sale }) => {
      return (
        <Paper className="store__product" key={`cp_${productId}`}>
          <section className="product-info">
            <section className="info">
              {id_sale && (
                <Tooltip
                  title={
                    <Typography color="inherit">
                      Promoção: {promotions[id_sale]}
                    </Typography>
                  }
                  placement="top"
                  arrow
                >
                  <InfoIcon className="store__icon--info" />
                </Tooltip>
              )}
              <Typography variant="title">{name}</Typography>
            </section>
          </section>
          <section>{formatCurrency(value)}</section>
          <section>
            <Input
              type="number"
              inputProps={{ min: "1" }}
              value={quantities[productId]}
              placeholder="Qtde"
              className="store__product__input"
              onChange={this.handleQuantityChange(productId)}
            />
            <IconButton onClick={this.handleRemoveFromCart(productId)}>
              <RemoveShoppingCartIcon />
            </IconButton>
          </section>
        </Paper>
      );
    });
  };

  renderBankslip = () => {
    const { bankslip, bankslipTotal } = this.props;

    if (bankslip.length == 0) return;

    return (
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Item</TableCell>
              <TableCell>Quantidade</TableCell>
              <TableCell>Preço</TableCell>
              <TableCell>Promoção</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bankslip.map((bsItem) => (
              <TableRow>
                <TableCell>{bsItem.product}</TableCell>
                <TableCell>{bsItem.quantity}</TableCell>
                <TableCell>{formatCurrency(bsItem.value)}</TableCell>
                <TableCell>{bsItem.sale || "-"}</TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell />
              <TableCell>
                <Typography variant="button">Total: </Typography>
              </TableCell>
              <TableCell>{formatCurrency(bankslipTotal)}</TableCell>
              <TableCell />
            </TableRow>
          </TableBody>
        </Table>
      </Paper>
    );
  };

  render() {
    const { cart } = this.state;
    return (
      <section className="store">
        <section className="items_and_cart">
          <section>
            <Typography variant="h4">Loja</Typography>
            <Divider />
            {this.renderProducts()}
          </section>
          <section>
            <Typography variant="h4">Carrinho</Typography>

            <Divider />
            {this.renderCart()}
          </section>
          <section className="items_and_cart__cta">
            <Button
              variant="outlined"
              color="primary"
              onClick={this.checkout}
              disabled={cart.length === 0}
            >
              Calcular Total
            </Button>
          </section>
        </section>

        {this.renderBankslip()}
      </section>
    );
  }
}

export default connectToStores(StoreView);
