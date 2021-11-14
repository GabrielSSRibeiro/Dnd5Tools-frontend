import React from "react";
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
// import api from "../services/api";

import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Home from "./pages/Home";
import EditCreature from "./pages/EditCreature";

export default function Routes() {
  return (
    <BrowserRouter>
      <Switch>
        <PrivateRoute path="/" exact component={Home} />
        <PrivateRoute path="/edit-creature" exact component={EditCreature} />
        <Route path="/login" exact component={Login} />
        <Route path="/signup" exact component={SignUp} />
        <Route render={() => <Redirect to="/login" />} />
      </Switch>
    </BrowserRouter>
  );
}
