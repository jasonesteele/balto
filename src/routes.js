import React from "react";
import {Route, Switch} from "react-router-dom";
import ScriptLibrary from "./components/ScriptLibrary";
import PageNotFound from "./components/PageNotFound";
import AddScript from "./components/AddScript";
import EditScript from "./components/EditScript";

export default props => (
        <Switch>
          <Route exact path='/' component={ ScriptLibrary } />
          <Route exact path='/add' component={ AddScript } />
          <Route exact path='/edit/:scriptId' component={ EditScript } />
          <Route path='/' component={ PageNotFound } />
        </Switch>
)