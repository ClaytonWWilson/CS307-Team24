/* eslint-disable */
import React, { Component } from 'react';
import '../App.css';

//import PropTypes from 'prop-types';
import StaticProfile from '../components/profile/StaticProfile';
//import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import PostSkeleton from '../util/PostSkeleton';

//import { connect } from 'react-redux';




class user extends Component {
  render() {

    return (
      <div>
        <h1>User Profile</h1>
        <br/><br/>
        
          <Card>
          <CardMedia
          component="img"
          height="140"
          width="345"
          image="twistter-frontend/src/images/twistter-logo.png"
          title="Post"
           />
          <CardContent>
            <b>This is the content of some post</b>
          </CardContent>

        </Card>
        <br/><br/>
      </div>
    )
  }
}



export default user;
