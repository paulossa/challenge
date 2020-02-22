import React, { Component } from "react";
import connectToStores from "alt-utils/lib/connectToStores";
import classnames from "classnames";

import alt from "../../alt";

import {
  Typography,
  Divider,
  Paper,
  IconButton,
  Input,
  Button,
  Tooltip
} from "@material-ui/core";

import InfoIcon from "@material-ui/icons/InfoRounded";
import ReceiptIcon from "@material-ui/icons/ReceiptRounded";
import AddShoppingCartIcon from "@material-ui/icons/AddShoppingCartRounded";
import RemoveShoppingCartIcon from "@material-ui/icons/RemoveShoppingCartRounded";

import { formatCurrency } from "../../global/utils";

import StoreStore from "./StoreStore";
import StoreActions from "./StoreActions";
import "./Store.css";

class StoreView extends Component {
  state = {
    cart: [],
    quantities: {}
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
        quantity: Math.max(qty, -qty)
      });
    }
    await StoreActions.checkout(payload);
  };

  handleQuantityChange = productId => ({ target: { value } }) => {
    this.setState({
      quantities: { ...this.state.quantities, [productId]: value }
    });
  };

  handleAddToCart = productId => () => {
    const { quantities, cart } = this.state;

    if (Object.keys(quantities).includes(`${productId}`)) {
      let product = this.props.products.find(p => p.id === productId);
      this.setState({ cart: [...cart, product] }, () => {
        StoreActions.removeFromProducts(product);
      });
    } else {
      alert("Selecione uma quantidade válida");
    }
  };

  handleRemoveFromCart = productId => () => {
    const { quantities, cart } = this.state;
    let new_quantities = {};
    for (const k of Object.keys(quantities)) {
      if (k !== productId) {
        new_quantities[k] = quantities[k];
      }
    }

    const product = cart.find(el => el.id === productId);

    this.setState(
      {
        quantities: new_quantities,
        cart: cart.filter(({ id }) => id !== productId)
      },
      () => {
        StoreActions.addToProducts(product);
      }
    );
  };

  renderProducts = () => {
    const { products, promotions } = this.props;
    return products.map(
      ({ id: productId, name, description, value, id_promotion }) => {
        return (
          <Paper className="store__product" key={`p_${productId}`}>
            <section className="product-info">
              <section>
                {id_promotion && (
                  <Tooltip
                    title={promotions[id_promotion]}
                    placement="top"
                    arrow
                  >
                    <InfoIcon className="store__icon--info" />
                  </Tooltip>
                )}
                <Typography variant="title">{name}</Typography>
                <Typography variant="body1">{description}</Typography>
              </section>
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
      }
    );
  };

  renderCart = () => {
    const { promotions } = this.props;
    const { quantities, cart } = this.state;

    return cart.map(
      ({ id: productId, name, description, value, id_promotion }) => {
        return (
          <Paper className="store__product" key={`cp_${productId}`}>
            <section className="product-info">
              <section>
                {id_promotion && (
                  <Tooltip
                    title={promotions[id_promotion]}
                    placement="top"
                    arrow
                  >
                    <InfoIcon className="store__icon--info" />
                  </Tooltip>
                )}
                <Typography variant="title">{name}</Typography>
                <Typography variant="body1">{description}</Typography>
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
      }
    );
  };

  renderBankslip = () => {
    const { bankslip } = this.props;
    let header = (
      <Paper className="item" key={`bs_header`}>
        <section>
          <Typography variant="button">Código</Typography>
        </section>
        <section>
          <Typography variant="button">Nome</Typography>
        </section>
        <section>
          <Typography variant="button">Quantidade</Typography>
        </section>
        <section>
          <Typography variant="button">Valor</Typography>
        </section>
        <section>
          <Typography variant="button">Promoção</Typography>
        </section>
      </Paper>
    );
    let items = bankslip.map(bsItem => {
      return (
        <Paper
          className={classnames("item", {
            "item--active": Boolean(bsItem.promotion)
          })}
          key={`bs_${bsItem.id}`}
          elevation={0}
        >
          <section>{bsItem.code}</section>
          <section>{bsItem.name}</section>
          <section>{bsItem.quantity}</section>
          <section>{formatCurrency(bsItem.value)}</section>
          <section>{bsItem.promotion || "-"}</section>
        </Paper>
      );
    });

    if (items.length > 0) {
      let bankslipTotal = bankslip.reduce(
        (total, curEl) => total + curEl.value,
        0
      );
      return (
        <section className="bankslip">
          <section className="inline">
            <ReceiptIcon />
            <Typography variant="title">Descrição da Compra</Typography>
          </section>
          <section className="bankslip__items">{[header, ...items]}</section>
          <section className="bankslip__total">
            <Typography variant="button">Total</Typography>

            {formatCurrency(bankslipTotal)}
          </section>
        </section>
      );
    }

    return null;
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
