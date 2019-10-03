import React, { Component } from 'react';
import '../App.css';

import logo from '../images/twistter-logo.png';
import axios from 'axios';
import TextField from '@material-ui/core/TextField';
import PropTypes from 'prop-types';


class Register extends Component {

  constructor() {
    super();
    this.state = {
        email: '',
        handle: '',
        password: '',
        confirmPassword: '',
        errors: {}
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
};


handleSubmit = (event) => {
   const newUserData = {
      email: this.state.email,
      handle: this.state.handle,
      password: this.state.password,
      confirmPassword: this.state.confirmPassword
  };
  axios.post('http://localhost:5001/twistter-e4649/us-central1/api/signup', newUserData)
  .then(res => {
      console.log(res.data);
      localStorage.setItem('firebaseIdToken', `Bearer ${res.data.token}`);
      this.props.history.push('/');
  })
  .catch(err => {
      this.setState({
          errors: err.response.data
      });
  });
  alert("You successfully registered");
  event.preventDefault();
  this.setState({email: '', handle: '', password: '', confirmPassword: ''});
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
        <b>Create your account</b>
        <br/><br/>
        <form noValidate onSubmit={this.handleSubmit}>

        <TextField className="authInput" id="email" name="email" label="Email" helperText={errors.email} error={errors.email ? true : false} 
                        value={this.state.email} onChange={this.handleChange}/>
        <br/><br/>
        <TextField className="authInput" id="username" name="handle" label="Username" helperText={errors.handle} error={errors.handle ? true : false} 
                        value={this.state.handle} onChange={this.handleChange} />
        <br/><br/>
        <TextField className="authInput" id="password" name="password" label="Password" helperText={errors.password} error={errors.password ? true : false} 
                        value={this.state.password} onChange={this.handleChange} />
        <br/><br/>
        <TextField className="authInput" id="confirmPassword" name="confirmPassword" label="Confirm Password" helperText={errors.confirmPassword} error={errors.confirmPassword ? true : false} 
                        value={this.state.confirmPassword} onChange={this.handleChange} />
        <br/><br/>
        {
                            errors.general && 
                            (<div className={classes.customError}>
                                {errors.general}
                            </div>)
        }
        <button class="authButtons register" id="submit">Sign up</button>
        </form>
      </div>
    );
  }
  
}
Register.propTypes = {
  classes: PropTypes.object.isRequired
};

export default Register;