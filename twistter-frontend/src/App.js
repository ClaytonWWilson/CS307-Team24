/* eslint-disable */
import React, { Component } from 'react';

import './App.css';

import { BrowserRouter as Router } from 'react-router-dom';
import Route from 'react-router-dom/Route';
import Navbar from './components/layout/NavBar';
import jwtDecode from 'jwt-decode';

// Components
import AuthRoute from './util/AuthRoute';

import home from './pages/Home';
import register from './pages/Register';
import login from './pages/Login';
import user from './pages/user';
import writeMicroblog from './Writing_Microblogs.js';
import edit from './pages/edit.js';
import userLine from './Userline.js';

let authenticated;
const token = localStorage.FBIdToken;
if (token) {
  const decodedToken = jwtDecode(token);
  if (decodedToken.exp * 1000 < Date.now()) {
    window.location.href = '/login';
    authenticated = false;
  } else {
    authenticated = true;
  }
}

class App extends Component {
  render() {
    return (
      <Router>
        <div className='container' >
          <Navbar />
        </div>
        <div className="app">
          <AuthRoute exact path="/" component={home} authenticated={authenticated}/>
          <AuthRoute exact path="/register" component={register} authenticated={authenticated}/>
          <AuthRoute exact path="/login" component={login} authenticated={authenticated}/>
          <Route exact path="/user" component={user}/>
          <Route exact path="/home" component={writeMicroblog}/>
          <Route exact path="/edit" component={edit}/>
          <Route exact path="/userline" component={userLine}/>
        </div>

      </Router>
    );
  }
}

export default App;
