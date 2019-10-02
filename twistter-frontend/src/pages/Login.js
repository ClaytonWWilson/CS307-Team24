import React, { Component } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import logo from '../images/twistter-logo.png';

// Material-UI stuff
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import withStyles from "@material-ui/core/styles/withStyles";

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
      loading: false,
      errors: {}
    };
  }

  // Runs whenever the submit button is clicked.
  // Updates the database entry of the signed in user with the
  // data stored in the state.
  handleSubmit = (event) => {
    event.preventDefault();
    this.setState({
      loading: true
    });
    const loginData = {
      email: this.state.email,
      password: this.state.password,
    };
    axios
      .post("/login", loginData)
      .then((res) => {
        // Save the login token
        localStorage.setItem('FBIdToken', `Bearer ${res.data.token}`);
        this.setState({
          loading: false
        });
        // Redirects to home page
        this.props.history.push('/home');
      })
      .catch((err) => {
        this.setState({
          errors: err.response.data,
          loading: false
        });
      });
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
    const { classes } = this.props;
    const { errors, loading } = this.state;

    return (
      <Grid container className={classes.form}>
        <Grid item sm />
        <Grid item sm>
        <img src={logo} className="app-logo" alt="logo" />
          <Typography variant="h2" className={classes.pageTitle}>
            Log in to Twistter
          </Typography>
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
              label="password*"
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
              <Typography color="error">Wrong Email or Password</Typography>
            )}
          </form>
        </Grid>
        <Grid item sm />
      </Grid>
    );
  }
}

Login.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Login);
