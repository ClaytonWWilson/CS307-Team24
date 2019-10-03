/* eslint-disable */
import React, { Component } from 'react';
import '../App.css';
import axios from 'axios';
import PropTypes from 'prop-types';

import logo from '../images/twistter-logo.png';
import TextField from '@material-ui/core/TextField';

class Login extends Component {
  constructor() {
    super();
    this.state = {
        email: '',
        password: '',
        errors: {}
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
};
handleSubmit = (event) => {
  event.preventDefault();
    const userData = {
        email: this.state.email,
        password: this.state.password
    };
    axios.post('http://localhost:5001/twistter-e4649/us-central1/api/login', userData)
    .then(res => {
        console.log(res.data);
        localStorage.setItem('firebaseIdToken', `Bearer ${res.data.token}`);
        this.props.history.push('/home');
    })
    .catch(err => {
        this.setState({
            errors: err.response.data
        });
    });
};
handleChange = (event) => {
    this.setState({
        [event.target.name]: event.target.value
    });
};

  render() {
    const { classes } = this.props;
    const { errors } = this.state;
    return (
      <div>
        <img src={logo} className="app-logo" alt="logo" />
        <br/><br/>
        <b>Log in to Twistter</b>
        <br/><br/>
        <form noValidate onSubmit={this.handleSubmit}>
        <TextField className="authInput" id="email" name="email" label="Email" helperText={errors.email} error={errors.email ? true : false} 
                        value={this.state.email} onChange={this.handleChange} />
        <br/><br/>
        <TextField className="authInput" id="password" name="password" label="Password" helperText={errors.password} error={errors.password ? true : false} 
                        value={this.state.password} onChange={this.handleChange}  />
        <br/><br/>

        <button className="authButtons register" type="submit">Sign in</button>
        </form>
      </div>
    );
  };
}
Login.propTypes = {
  classes: PropTypes.object.isRequired
};


export default Login;