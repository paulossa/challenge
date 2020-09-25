import React, { Component } from "react";

import {
  Typography,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Button,
} from "@material-ui/core";

import RoutesConfig from "../../RoutesConfig";
import connectToStores from "alt-utils/lib/connectToStores";
import UpsertProductActions from "./UpsertProductActions";
import UpsertProductStore from "./UpsertProductStore";

import alt from "../../alt";

import "./UpsertProduct.css";

export class UpsertProduct extends Component {
  state = {
    name: "",
    identifier: "",
    value: "",
    id_sale: "",
  };

  static getPropsFromStores() {
    return UpsertProductStore.getState();
  }

  static getStores() {
    return [UpsertProductStore];
  }

  componentDidMount() {
    this.getProduct();
    this.getPromotions();
  }

  componentWillUnmount() {
    alt.recycle(UpsertProductStore);
  }

  getPromotions = () => {
    UpsertProductActions.getPromotions().catch(() =>
      alert("Houve um erro ao buscar as promoções")
    );
  };

  getProduct = () => {
    const {
      match: {
        params: { id },
      },
    } = this.props;

    if (id) {
      UpsertProductActions.getProduct(id)
        .then(() => {
          this.setState({ ...this.props.product });
        })
        .catch(() => {
          alert(
            `Ocorreu um erro ao buscar informações de produto com id = ${id}`
          );
          this.props.history.push(RoutesConfig.products());
        });
    }
  };

  renderPromotionItem = (promotion) => (
    <MenuItem value={promotion.id} key={promotion.id}>
      {promotion.description}
    </MenuItem>
  );

  handleChange = ({ target: { name, value } }) => {
    this.setState({ [name]: value });
  };

  handleSubmit = (evt) => {
    evt.preventDefault();
    UpsertProductActions.putProduct(this.state)
      .then(() => {
        alert("Produto atualizado com sucesso");
        this.props.history.push(RoutesConfig.products());
      })
      .catch((error) => {
        let msg = "Houve um erro ao criar produto";
        if (error.response && error.response.data.message) {
          msg = error.response.data.message;
        }
        alert(msg);
      });
  };

  render() {
    const { promotions } = this.props;
    const { identifier, name, value, id_sale } = this.state;

    return (
      <section className="upsert-product content-container">
        <Typography variant="h4">Editar Produto</Typography>
        <Divider />
        <form onSubmit={this.handleSubmit}>
          <TextField
            label="Código"
            name="identifier"
            value={identifier}
            onChange={this.handleChange}
            fullWidth
          />
          <TextField
            label="Nome"
            name="name"
            value={name}
            onChange={this.handleChange}
            fullWidth
          />

          <TextField
            label="Valor"
            name="value"
            value={value}
            onChange={this.handleChange}
            fullWidth
          />

          <FormControl className="product__item__select">
            <InputLabel>Promoção</InputLabel>
            <Select
              value={id_sale || ""}
              name="id_sale"
              onChange={this.handleChange}
            >
              <MenuItem value={""}>
                <em>Nenhuma</em>
              </MenuItem>
              {promotions.map(this.renderPromotionItem)}
            </Select>
          </FormControl>
          <Button type="submit" color="primary" variant="contained">
            EDITAR
          </Button>
        </form>
      </section>
    );
  }
}

export default connectToStores(UpsertProduct);
