/* eslint-disable */
import React, { Component } from 'react';
import axios from 'axios';
//import '../App.css';
import { makeStyles, styled } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';

const PostCard = styled(Card)({
  background: 'linear-gradient(45deg, #1da1f2 90%)',
  border: 3,
  borderRadius: 3,
  height:225,
  width: 345,
  padding: '0 30px',
});

class user extends Component {
  componentDidMount(){
    //TODO: get user details
    //TODO: get posts
  }

  render() {
    
    return (
      <Grid container spacing={16}>
        <Grid item sm={8} xs={12}>
          <p>Post</p>
        </Grid>
        <Grid item sm={4} xs={12}>
          <PostCard>Profile here</PostCard>
        </Grid>
      </Grid>
    )
  }
}



export default user;
