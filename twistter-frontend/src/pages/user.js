/* eslint-disable */
import React, { Component } from 'react';
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
  width: 645,
  padding: '0 30px',
});

class user extends Component {
  render() {
    
    return (
      <div>
        <h1>User Profile</h1>
        <br/><br/>
        <PostCard>Some card and content</PostCard>
        <br/><br/>
      </div>
    )
  }
}



export default user;
