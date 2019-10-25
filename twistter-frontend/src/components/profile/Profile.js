import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { connect } from 'react-redux';

//MUI
import withStyles from "@material-ui/core/styles/withStyles";
import Card from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { Paper } from "@material-ui/core";

const styles = theme => ({
  ...theme
});

class Profile extends Component {
  state = {
    profile: null
  };

  componentDidMount() {
    axios
      .get("/user")
      .then(res => {
        console.log(res.data.userData.credentials.handle);
        this.setState({
          profile: res.data.userData.credentials.handle
        });
      })
      .catch(err => console.log(err));
  }
  render() {
    let profileMarkup = this.state.profile ? (
        <p>
        <Typography variant='h5'>{this.state.profile}</Typography>
        </p>) : <p>loading profile...</p>

    return profileMarkup;
  }
}

const mapStateToProps = state => ({
  user: state.user,
  classes: PropTypes.object.isRequired
});

export default connect(mapStateToProps)(withStyles(styles)(Profile));
