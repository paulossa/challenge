import React, { PureComponent } from "react";
import { AppBar, Toolbar } from "@material-ui/core";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Link,
  Redirect,
} from "react-router-dom";

import ROUTES_CONFIG from "./RoutesConfig";

import Product from "./views/product/Product";
import StoreView from "./views/store/Store";
import UpsertProduct from "./components/upsertProduct/UpsertProduct";

import "./App.css";
import Promotion from "./views/promotion/Promotion";

class App extends PureComponent {
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
            <Route exact path={ROUTES_CONFIG.store()} component={StoreView} />
            <Route exact path={ROUTES_CONFIG.products()} component={Product} />
            <Route
              exact
              path={ROUTES_CONFIG.productsEdit()}
              component={UpsertProduct}
            />
            <Route
              exact
              path={ROUTES_CONFIG.productsNew()}
              component={UpsertProduct}
            />
            <Route
              path={`${ROUTES_CONFIG.sales_promotion()}`}
              component={Promotion}
            />

            <Route
              render={() => {
                return <Redirect to={ROUTES_CONFIG.store()} />;
              }}
            />
          </Switch>
        </Router>
      </div>
    );
  }
}

export default App;
