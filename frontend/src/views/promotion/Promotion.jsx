import React, { Component } from "react";
import connectToStores from "alt-utils/lib/connectToStores";
import PromotionStore from "./PromotionStore";

import {
  Typography,
  Divider,
  Paper,
  TableHead,
  TableRow,
  TableCell,
  Table,
  TableBody,
} from "@material-ui/core";
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

    return (
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography variant="headline">Descrição</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {promotions.map((item) => (
              <TableRow>
                <TableCell>
                  {item.description}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    );
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
