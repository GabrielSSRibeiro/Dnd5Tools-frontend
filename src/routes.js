import React from "react";
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";
// import api from "../services/api";

import Home from "./pages/Home";

export default function Routes() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={Home} />
        <Route render={() => <Redirect to="/" />} />
      </Switch>
    </BrowserRouter>
  );
}
