/* eslint-disable */
import React, { Component } from 'react';
// import '../App.css';
import PropTypes from 'prop-types';

import logo from '../images/twistter-logo.png';

// Material-UI stuff
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import withStyles from "@material-ui/core/styles/withStyles";

// Redux stuff
import { connect } from 'react-redux';
import { signupUser } from '../redux/actions/userActions';

const styles = {
  form: {
    textAlign: "center"
  },
  textField: {
    marginBottom: 30
  },
  pageTitle: {
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

export class Signup extends Component {

  // Constructor for the state
  constructor() {
    super();
    this.state = {
      handle: "",
      email: "",
      password:"",
      confirmPassword: "",
      errors: {}
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.UI.errors) {
      this.setState({ errors: nextProps.UI.errors });
    }
  }

  // Runs whenever the submit button is clicked.
  // Updates the database entry of the signed in user with the
  // data stored in the state.
  handleSubmit = (event) => {
    event.preventDefault();
    const signupData = {
      handle: this.state.handle,
      email: this.state.email,
      password: this.state.password,
      confirmPassword: this.state.confirmPassword
    };
    console.log(signupData)
    this.props.signupUser(signupData, this.props.history);
  };

  // Updates the state whenever one of the textboxes changes.
  // The key is the name of the textbox and the value is the
  // value in the text box.
  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
      errors: {
        [event.target.name]: null
      }
    });
  };

  render() {
    const { classes, UI: { loading } } = this.props;
    const { errors } = this.state;

    return (
      <Grid container className={classes.form}>
        <Grid item sm />
        <Grid item sm>
        <img src={logo} className="app-logo" alt="logo" />
          <Typography variant="h2" className={classes.pageTitle}>
            Create a new account
          </Typography>
          <form noValidate onSubmit={this.handleSubmit}>
          <TextField
              id="handle"
              name="handle"
              label="Username*"
              className={classes.textField}
              value={this.state.handle}
              helperText={errors.handle}
              error={errors.handle ? true : false}
              variant="outlined"
              onChange={this.handleChange}
              fullWidth
            />
            <TextField
              id="email"
              name="email"
              label="Email*"
              className={classes.textField}
              value={this.state.email}
              helperText={errors.email}
              error={errors.email ? true : false}
              variant="outlined"
              onChange={this.handleChange}
              fullWidth
            />
            <TextField
              id="password"
              name="password"
              label="Password*"
              className={classes.textField}
              value={this.state.password}
              helperText={errors.password}
              error={errors.password ? true : false}
              type="password"
              variant="outlined"
              onChange={this.handleChange}
              fullWidth
            />
            <TextField
              id="confirmPassword"
              name="confirmPassword"
              label="Confirm Password*"
              className={classes.textField}
              value={this.state.confirmPassword}
              helperText={errors.confirmPassword}
              error={errors.confirmPassword ? true : false}
              type="password"
              variant="outlined"
              onChange={this.handleChange}
              fullWidth
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              className={classes.button}
              disabled={loading}
            >
              Sign Up
              {loading && (
                <CircularProgress size={30} className={classes.progress} />
              )}
            </Button>
            {errors.general && (
              <Typography color="error">Invalid username/email or password</Typography>
            )}
          </form>
        </Grid>
        <Grid item sm />
      </Grid>
    );
  }
}

// Proptypes just confirms that all data in it exists and is of the type that it
// is declared to be
Signup.propTypes = {
  classes: PropTypes.object.isRequired,
  signupUser: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  UI: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  user: state.user,
  UI: state.UI,
});

const mapActionsToProps = {
  signupUser
}

Signup.propTypes = {
  classes: PropTypes.object.isRequired
};

// This mapStateToProps is just synchronizing the 'state' to 'this.props' so we can access it
// The state contains info about the current logged in user

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(Signup));