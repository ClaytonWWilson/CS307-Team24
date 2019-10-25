/* eslint-disable */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
//import '../App.css';
import { makeStyles, styled } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import Chip from '@material-ui/core/Chip';
import Paper from '@material-ui/core/Paper';
import Typography from "@material-ui/core/Typography";


// component
import Profile from '../components/profile/Profile';
import Userline from '../Userline';
import noImage from '../images/no-img.png';


const PostCard = styled(Card)({
  background: 'linear-gradient(45deg, #1da1f2 90%)',
  border: 3,
  borderRadius: 3,
  height:325,
  width: 345,
  padding: '0 30px',
});


class user extends Component {
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

    return (
      <Grid container spacing={16}>
        <Grid item sm={8} xs={12}>
          <p>Post</p>
        </Grid>
        <Grid item sm={4} xs={12}>
          <img src={noImage}/>
          {profileMarkup}
        </Grid>
      </Grid>
    );
  }
}

Userline.PropTypes = {
  handle: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  user: state.user
});

export default user;
