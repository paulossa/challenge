import React, { PureComponent } from "react";
import connectToStores from "alt-utils/lib/connectToStores";
import { AppBar, Toolbar } from "@material-ui/core";
import { BrowserRouter as Router, Route, Switch, Link, Redirect } from "react-router-dom";

import ROUTES_CONFIG from "./RoutesConfig";

import Product from "./views/product/Product";
import UpsertProduct from './components/upsertProduct/UpsertProduct';

import "./App.css";

class App extends PureComponent {
  static getStores() {
    return [];
  }

  static getPropsFromStores() {
    return {};
  }

  render() {
    return (
      <div className="app">
        <Router>
          <AppBar position="static" className="app_nav">
            <Toolbar>
              <section className="app_nav_links">
                <Link to={ROUTES_CONFIG.store()}>Loja</Link>
                <section>
                  <Link to={ROUTES_CONFIG.products()}>Produtos</Link>
                  <Link to={ROUTES_CONFIG.sales_promotion()}>Promoções</Link>
                </section>
              </section>
            </Toolbar>
          </AppBar>

          <Switch>
            <Route
              exact
              path={ROUTES_CONFIG.store()}
              render={props => <h4>TODO</h4>}
            />
            <Route exact path={ROUTES_CONFIG.products()} component={Product} />
            <Route exact path={ROUTES_CONFIG.productsEdit()} component={UpsertProduct} />
            <Route
              path={`${ROUTES_CONFIG.sales_promotion()}*`}
              render={() => " 404 Not found"}
            />

            <Route
              render={() => {
                return <Redirect to={ROUTES_CONFIG.store()} />
              }}/>
          </Switch>
        </Router>
      </div>
    );
  }
}

export default connectToStores(App);
