import React, { Component } from 'react';
import './App.css';

import logo from './twistter-logo.png';

class Home extends Component {
  render() {
    return (
      <div>
        <div>
          <img src={logo} className="app-logo" alt="logo" />
          <br/><br/>
          <b>Welcome to Twistter!</b> 
          <br/><br/>
          <b>See the most interesting topics people are following right now.</b> 
        </div>

        <br/><br/><br/><br/>

        <div>                    
          <b>Join today or sign in if you already have an account.</b> 
          <br/><br/>
          <form action="./register">
            <button className="authButtons register">Sign up</button> 
          </form>
          <br/><br/>
          <form action="./login">
            <button className="authButtons login">Sign in</button>
          </form>
        </div>
      </div>
    );
    }
  }

export default Home;