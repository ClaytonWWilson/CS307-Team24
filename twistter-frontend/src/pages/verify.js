import React, { Component } from "react";
import axios from "axios";
import PropTypes from "prop-types";
// TODO: Add a read-only '@' in the left side of the handle input
// TODO: Add a cancel button, that takes the user back to their profile page

// Material-UI stuff
import Button from "@material-ui/core/Button";
import { Link } from 'react-router-dom';
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
    marginBottom: 10
  },
  progress: {
    position: "absolute"
  }
};

export class verify extends Component {

  // Constructor for the state
  constructor() {
    super();
    this.state = {
      handle: "",
      loading: false,
      errors: {}
    };
  }

//   // Runs whenever the submit button is clicked.
  handleSubmit = (event) => {
    event.preventDefault();
    this.setState({
      loading: true
    });
    const verifyHandle = {
      user: this.state.handle
    };
      
    axios
      .post("/verifyUser", verifyHandle)
      .then((res) => {
        console.log(res);
        this.setState({
          loading: false
        });
        // this.props.history.push('/');
        // TODO: Need to redirect user to their profile page
      })
      .catch((err) => {
        console.log(err);
        this.setState({
          errors: err.response.data,
          loading: false
        });
      });
  };

  // Updates the state whenever one of the textboxes changes.
  // The key is the name of the textbox and the value is the
  // value in the text box.
  // Also sets errors to null of textboxes that have been edited
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
    const { loading } = this.state;

    return (
      <Grid container className={classes.form}>
        <Grid item sm />
        <Grid item sm>
          <Typography variant="h4" className={classes.pageTitle}>
            Verify Users
          </Typography>
          <form noValidate onSubmit={this.handleSubmit}>
            <TextField
              id="handle"
              name="handle"
              label="Username"
              className={classes.textField}
              value={this.state.handle}
              // helperText={errors.handle}
              // error={errors.handle ? true : false}
              variant="outlined"
              onChange={this.handleChange}
              fullWidth
            />
            <Grid container direction="column">
              <Grid item>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  className={classes.button}
                  disabled={loading}
                >
                  Submit
                  {loading && (
                    <CircularProgress size={30} className={classes.progress} />
                  )}
                </Button>
              </Grid>
              <Grid item>
                <Button
                  variant="oulined"
                  color="primary"
                  // className={classes.button}
                  component={ Link }
                  to='/user'
                >
                  Back to Profile
                </Button>
              </Grid>
            </Grid>
          </form>
        </Grid>
        <Grid item sm />
      </Grid>
    );
  }
}

verify.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(verify);
