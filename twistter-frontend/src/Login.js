import React, { Component } from 'react';
import './App.css';

import logo from './twistter-logo.png';

class Login extends Component {
  render() {
    return (
      <div>
        <img src={logo} className="app-logo" alt="logo" />
        <br/><br/>
        <b>Log in to Twistter</b>
        <br/><br/>
        <input class="authInput" placeholder="Username or email"></input>
        <br/><br/>
        <input class="authInput" placeholder="Password"></input>
        <br/><br/>
        <button class="authButtons register">Sign in</button>
      </div>
    );
  }
}

export default Login;