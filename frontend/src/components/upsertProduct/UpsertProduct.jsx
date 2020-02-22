import React, { Component } from "react";

import {
  Typography,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Button
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
    description: "",
    code: "",
    value: "",
    id_promotion: ""
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

  getPromotions = async () => {
    try {
      await UpsertProductActions.getPromotions();
    } catch (error) {
      alert("Houve um erro ao buscar as promoções");
    }
  };

  getProduct = async () => {
    const {
      match: {
        params: { id }
      }
    } = this.props;

    try {
      if (id) {
        console.log('ageat proa')
        
        await UpsertProductActions.getProduct(id);
        console.log(this.state.product)
        this.setState({...this.props.product})
      }
    } catch (error) {
      this.props.history.push(RoutesConfig.products());
    }
  };

  renderPromotionItem = promotion => (
    <MenuItem value={promotion.id} key={promotion.id}>
      {promotion.type}
    </MenuItem>
  );

  handleChange = evt => {
    this.setState({ [evt.target.name]: evt.target.value });
  };

  handleSubmit = async evt => {
    evt.preventDefault();

    try {
      await UpsertProductActions.putProduct(this.state);
      alert("Produto atualizado com sucesso");
      this.props.history.push(RoutesConfig.products());
    } catch (error) {
      let msg = "Houve um erro ao criar produto";
      if (error.response && error.response.data.message) {
        msg = error.response.data.message;
      }
      alert(msg);
    }
  };

  render() {
    const { promotions } = this.props;
    const { code, name, description, value, id_promotion } = this.state;

    return (
      <section className="upsert-product content-container">
        <Typography variant="h4">Editar Produto</Typography>
        <Divider />
        <form onSubmit={this.handleSubmit}>
          <TextField
            label="Código"
            name="code"
            value={code}
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
            label="Descrição"
            name="description"
            rows={3}
            value={description}
            onChange={this.handleChange}
            fullWidth
            multiline
          />

          <TextField
            label="Valor (em centavos)"
            name="value"
            value={value}
            onChange={this.handleChange}
            fullWidth
          />

          <FormControl className="product__item__select">
            <InputLabel>Promoção</InputLabel>
            <Select
              value={id_promotion || ""}
              name="id_promotion"
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
