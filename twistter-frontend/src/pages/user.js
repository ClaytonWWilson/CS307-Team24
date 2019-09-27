/* eslint-disable */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import StaticProfile from '../components/profile/StaticProfile';
import Grid from '@material-ui/core/Grid';

import PostSkeleton from '../util/PostSkeleton';

import { connect } from 'react-redux';


class user extends Component {
  render() {
    const postMarkup = PostSkeleton;

    return (
      <b>User page</b>
      // <Grid container spacing={16}>
      //   <Grid item sm={8} xs={12}>
      //     <b>postMarkup</b>
      //     {postMarkup}
      //   </Grid>
      //   {/* <Grid item sm={4} xs={12}>
      //       <StaticProfile profile={this.state.profile} />
      //   </Grid> */}
      // </Grid>
    )
  }
}

user.propTypes = {
  // getUserData: PropTypes.func.isRequired,
  //data: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  data: state.data
});

export default connect(user);
