import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";

import UserProfileBox from './pages/UserProfileBox';
import NotFound from './pages/NotFound';

const routing = (
  <Router>
    <Switch>
      <Route exact path="/profile" component={UserProfileBox} />
      <Route component={ NotFound } />
    </Switch>
  </Router>
)

ReactDOM.render(routing, document.getElementById('app'))
