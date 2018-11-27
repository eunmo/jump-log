import React from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';

import Titles from './components/titles';
import NewIssue from './components/new';

const Routes = (props) => (
  <BrowserRouter>
    <div>
      <Switch>
        <Redirect from="/" to="/titles/2018" exact={true} />
        <Redirect from="/titles/new" to="/new" exact={true} />
        <Route path="/titles/:year" component={Titles} />
        <Route path="/new" component={NewIssue} />
      </Switch>
    </div>
  </BrowserRouter>
);

export default Routes;

