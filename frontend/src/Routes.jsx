import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import ROUTES_CONFIG from "./RoutesConfig";
import Product from "./views/product/Product";

export default props => (
  <Router>
    {props.children}
    <Switch>
      <Route
        exact
        path={ROUTES_CONFIG.store()}
        render={props => <h4>TODO</h4>}
      />
      <Route exact path={ROUTES_CONFIG.products()} component={Product} />
      <Route
        path={`${ROUTES_CONFIG.sales_promotion()}*`}
        render={() => " 404 Not found"}
      />
    </Switch>
  </Router>
);
