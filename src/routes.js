import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Titles from './components/titles';
import NewIssue from './components/new';

const Routes = (props) => (
  <BrowserRouter>
    <div>
      <Switch>
        <Route path="/" exact={true} component={Titles} />
        <Route path="/new" component={NewIssue} />
      </Switch>
    </div>
  </BrowserRouter>
);

export default Routes;

