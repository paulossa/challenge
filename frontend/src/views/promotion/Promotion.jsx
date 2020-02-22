import React, { Component } from "react";
import connectToStores from "alt-utils/lib/connectToStores";
import PromotionStore from "./PromotionStore";

import { Typography, Divider, Paper } from "@material-ui/core";
import PromotionActions from "./PromotionActions";

import "./Promotion.css";
class Promotion extends Component {
  static getPropsFromStores() {
    return PromotionStore.getState();
  }

  static getStores() {
    return [PromotionStore];
  }

  componentDidMount() {
    this.getPromotions();
  }

  getPromotions = async () => {
    try {
      await PromotionActions.getPromotions();
    } catch (error) {
      alert("Houve um erro ao buscar as promoções");
    }
  };

  renderPromotions = () => {
    const { promotions } = this.props;

    const header = (
      <Paper className="promotion__item">
        <Typography variant="button">Tipo</Typography>
        <Typography variant="button">Descrição</Typography>
      </Paper>
    );

    const items = promotions.map(({ type, description }) => {
      return (
        <Paper className="promotion__item">
          <section>{type}</section>
          <section>{description}</section>
        </Paper>
      );
    });

    return [header, ...items];
  };

  render() {
    return (
      <section className="content-container promotion">
        <Typography variant="h4">Lista de Promoções</Typography>
        <Divider />
        <section>{this.renderPromotions()}</section>
      </section>
    );
  }
}

export default connectToStores(Promotion);
