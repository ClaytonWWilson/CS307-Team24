/* eslint-disable */
import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

// Material UI stuff
import AppBar from "@material-ui/core/AppBar";
import ToolBar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import withStyles from "@material-ui/core/styles/withStyles";

// Redux stuff
import { logoutUser } from "../../redux/actions/userActions";
import { connect } from "react-redux";

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

export class Navbar extends Component {
  render() {
    const authenticated = this.props.user.authenticated;
    return (
      <AppBar>
        <ToolBar>
          <Button component={Link} to="/">
            Home
          </Button>
          {authenticated && (
            <Button component={Link} to="/user">
              Profile
            </Button>
          )}
          {authenticated && (
            <Button component={Link} to="/dm">
              DMs
            </Button>
          )}
          {!authenticated && (
            <Button component={Link} to="/login">
              Login
            </Button>
          )}
          {!authenticated && (
            <Button component={Link} to="/signup">
              Sign Up
            </Button>
          )}
          {authenticated && (
            <Button component={Link} to="/search">
              Search
            </Button>
          )}
          {authenticated && (
            <Button style={{position: "absolute", right: 30}} component={Link} to="/logout">
              Logout
            </Button>
          )}
        </ToolBar>
      </AppBar>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user
});

Navbar.propTypes = {
  user: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired
};

export default connect(mapStateToProps)(withStyles(styles)(Navbar));
