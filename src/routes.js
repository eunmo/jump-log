import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Titles from './components/titles';

const Routes = (props) => (
  <BrowserRouter>
    <div>
      <Switch>
        <Route path="/" component={Titles} />
      </Switch>
    </div>
  </BrowserRouter>
);

export default Routes;

