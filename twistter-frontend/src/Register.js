import React, { Component } from 'react';
import './App.css';

import logo from './twistter-logo.png';

class Register extends Component {
  render() {
    return (
      <div>
        <img src={logo} className="app-logo" alt="logo" />
        <br/><br/>
        <b>Create your account</b>
        <br/><br/>
        <input class="authInput" id="email" placeholder="Email"></input>
        <br/><br/>
        <input class="authInput" id="username" placeholder="Username"></input>
        <br/><br/>
        <input class="authInput" id="password" placeholder="Password"></input>
        <br/><br/>
        <input class="authInput" id="confirmPassword" placeholder="Confirm Password"></input>
        <br/><br/>
        <button class="authButtons register" id="submit">Sign up</button>
      </div>
    );
  }
}

export default Register;