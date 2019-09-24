import React, { Component } from 'react';
import './App.css';

import logo from './twistter-logo.png';
import TextField from '@material-ui/core/TextField';

import axios from 'axios';

class Login extends Component {
  render() {
    return (
      <div>
        <img src={logo} className="app-logo" alt="logo" />
        <br/><br/>
        <b>Log in to Twistter</b>
        <br/><br/>
        <TextField className="authInput" id="email" name="email" label="Email" />
        <br/><br/>
        <TextField className="authInput" id="password" name="password" label="Password" />
        <br/><br/>
        <button className="authButtons register" type="submit">Sign in</button>
      </div>
    );
  };
}

export default Login;