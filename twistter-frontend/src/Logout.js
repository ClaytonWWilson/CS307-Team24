/* eslint-disable */
import React, { Component} from 'react';
import './App.css';
import logo from './images/twistter-logo.png';
import TextField from '@material-ui/core/TextField';
import logoutUser from '../redux/actions/userActions.js'
import { Tooltip, IconButton } from '@material-ui/core';
import writeMicroblog from './Writing_Microblogs.js';
import PropTypes from "prop-types";

class Logout extends Component {
  handleLogout = () => {
    localStorage.removeItem("FBIdToken");
    alert("Successfully Logged Out");
    this.props.history.push('/');
  };
  render() {
    return(
      <div>
	    <img src={logo} className="app-logo" alt="logo" />
      <br/><br/>
	    <b>Logout of your Twistter Account</b>
      <br/><br/>
      <br/><br/>
	    <button className="authButtons register" onClick={this.handleLogout} type="submit">Sign Out</button>
      </div>
    );
  };
}
Logout.protoTypes = {
  classes: PropTypes.object.isRequired,
  logoutUser: PropTypes.object.isRequired
};

const mapActionsToProps = {
  logoutUser
}

export default Logout;
