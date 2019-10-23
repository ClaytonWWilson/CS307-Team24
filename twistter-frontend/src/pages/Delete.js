/* eslint-disable */
import React, { Component } from "react";
import PropTypes from "prop-types";

// Material UI stuff
import Button from "@material-ui/core/Button";
import withStyles from "@material-ui/core/styles/withStyles";

// Redux stuff
import { deleteUser } from "../redux/actions/userActions";
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

export class Delete extends Component {

  componentDidMount() {
    this.props.deleteUser();
    this.props.history.push('/');
  }

  render() {
    return null;
  }
}

const mapStateToProps = (state) => ({
  user: state.user
});

const mapActionsToProps = { deleteUser };

Delete.propTypes = {
  deleteUser: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired
};

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(Delete));
