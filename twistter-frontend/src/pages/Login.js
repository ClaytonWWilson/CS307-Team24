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
import { loginUser } from '../redux/actions/userActions';
import { fontFamily } from '@material-ui/system';

//Theme
const styles = {
  form: {
    textAlign: "center"
  },
  textField: {
    marginBottom: 20
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
  },
  p: {
    fontFamily: "cursive",
  }
};

export class Login extends Component {
  // componentDidMount() {
  //   axios
  //     .get("/getProfileInfo")
  //     .then((res) => {
  //       this.setState({
  //         firstName: res.data.firstName,
  //         lastName: res.data.lastName,
  //         email: res.data.email,
  //         handle: res.data.handle,
  //         bio: res.data.bio
  //       });
  //     })
  //     .catch((err) => {
  //       console.error(err);
  //     });
  // }

  // Constructor for the state
  constructor() {
    super();
    this.state = {
      email: "",
      password:"",
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
    const loginData = {
      email: this.state.email,
      password: this.state.password,
    };
    this.props.loginUser(loginData, this.props.history);
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
          <br></br>
          <Typography variant="h6" className={classes.pageTitle} fontFamily = "Georgia, serif">
            <b>Log in to Twistter</b>
            <br></br>
          </Typography>
          <br></br>
          <form noValidate onSubmit={this.handleSubmit}>
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
            <Button
              type="submit"
              variant="contained"
              color="primary"
              className={classes.button}
              disabled={loading}
            >
              Login
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
Login.propTypes = {
  classes: PropTypes.object.isRequired,
  loginUser: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  UI: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  user: state.user,
  UI: state.UI,
});

const mapActionsToProps = {
  loginUser
}

Login.propTypes = {
  classes: PropTypes.object.isRequired
};

// This mapStateToProps is just synchronizing the 'state' to 'this.props' so we can access it
// The state contains info about the current logged in user

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(Login));
