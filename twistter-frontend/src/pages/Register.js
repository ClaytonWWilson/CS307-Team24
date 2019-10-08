import React, { Component } from 'react';
import '../App.css';

import logo from '../images/twistter-logo.png';
import axios from 'axios';
import TextField from '@material-ui/core/TextField';
import PropTypes from 'prop-types';

// Redux Stuff
import {connect} from 'react-redux';
import {signupUser, logoutUser} from '../redux/actions/userActions';
import withStyles from '@material-ui/core/styles/withStyles';

const styles = {
  form: {
    textAlign: "center"
  },
  textField: {
    marginBottom: 30
  },
  pageTitle: {
    // marginTop: 20,
    marginBottom: 40
  },
  button: {
    positon: "relative",
    marginBottom: 30
  },
  progress: {
    position: "absolute"
  }
};

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

  componentWillReceiveProps(nextProps) {
    if (nextProps.UI.errors) {
      this.setState({ errors: nextProps.UI.errors });
    }
  }

  handleSubmit = (event) => {
    event.preventDefault();
    this.setState({
    loading: true
  });

   const newUserData = {
      email: this.state.email,
      handle: this.state.handle,
      password: this.state.password,
      confirmPassword: this.state.confirmPassword
  };

  this.props.signupUser(newUserData, this.props.history);
};
 
 
handleChange = (event) => {
  this.setState({
      [event.target.name]: event.target.value
  });
};

  render() {
    const { classes, UI: { loading } } = this.props;
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
        {/* {
          loading && <TextField>Loading...</TextField>
        } */}
        <button class="authButtons register" id="submit">Sign up</button>
        </form>
      </div>
    );
  }
  
}
Register.propTypes = {
  classes: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  UI: PropTypes.object.isRequired,
  signupUser: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
  user: state.user,
  UI: state.UI
});

export default connect(mapStateToProps, {signupUser})(withStyles(styles)(Register));