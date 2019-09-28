/* eslint-disable */
import React, { Component } from 'react';

import './App.css';

import { BrowserRouter as Router } from 'react-router-dom';
import Route from 'react-router-dom/Route';


import home from './Home.js';
import register from './Register.js';
import login from './Login.js';

class App extends Component {
  render() {
    return (
      <Router>


        <div className="app">
          <Route exact path="/" component={home}/>
          <Route exact path="/register" component={register}/>
          <Route exact path="/login" component={login}/>
          <Route exact path="/user" component={user}/>
        </div>

      </Router>
    );
  }
}

export default App;