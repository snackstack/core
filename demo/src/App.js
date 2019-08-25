import React from 'react';
import { HashRouter, Route, Link, Redirect, Switch } from 'react-router-dom';
import Home from './components/Home';
import About from './components/About';

const App = () => {
  return (
    <HashRouter basename="/" hashType="noslash">
      This is currently just for testing client-side routing with gh-pages
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/about">About</Link>
        </li>
      </ul>
      <hr />
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/about" component={About} />
        <Route render={() => <Redirect to="/" />} />
      </Switch>
    </HashRouter>
  );
};

export default App;
