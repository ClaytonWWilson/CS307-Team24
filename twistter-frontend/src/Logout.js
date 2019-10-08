/* eslint-disable */
import React, { Component} from 'react';
import './App.css';
import logo from './images/twistter-logo.png';
import TextField from '@material-ui/core/TextField';

class Logout extends Component {
  render() {
    return(
      <div>
	    <img src={logo} className="app-logo" alt="logo" />
      <br/><br/>
	    <b>Logout of your Twistter Account</b>
      <br/><br/>
      <br/><br/>
	    <button className="authButtons signup" type="submit">Sign Out</button>
      </div>
    );
  };
}

export default Logout;
