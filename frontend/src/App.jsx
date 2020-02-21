import React, { PureComponent } from "react";
import connectToStores from "alt-utils/lib/connectToStores";
import { Link } from'react-router-dom';

import { AppBar, Toolbar } from '@material-ui/core'

import ROUTES_CONFIG from './RoutesConfig';

import Routes from "./Routes";

import './App.css';

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
        <Routes>
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
        </Routes>
      </div>
    );
  }
}

export default connectToStores(App);
