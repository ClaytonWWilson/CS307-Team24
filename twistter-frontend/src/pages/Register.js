import React, { Component } from 'react';
import '../App.css';

import logo from '../images/twistter-logo.png';
import TextField from '@material-ui/core/TextField';

class Register extends Component {
  render() {
    return (
      <div>
        <img src={logo} className="app-logo" alt="logo" />
        <br/><br/>
        <b>Create your account</b>
        <br/><br/>
        <TextField className="authInput" id="email" name="email" label="Email" />
        <br/><br/>
        <TextField className="authInput" id="username" name="username" label="Username" />
        <br/><br/>
        <TextField className="authInput" id="password" name="password" label="Password" />
        <br/><br/>
        <TextField className="authInput" id="confirmPassword" name="confirmPassword" label="Confirm Password" />
        <br/><br/>
        <button class="authButtons register" id="submit">Sign up</button>
      </div>
    );
  }
}

export default Register;