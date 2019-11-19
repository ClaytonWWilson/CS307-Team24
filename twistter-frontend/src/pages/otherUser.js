/* eslint-disable */
import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import axios from "axios";
//import '../App.css';

// Material UI and React Router
import { makeStyles, styled } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";

import Chip from "@material-ui/core/Chip";
import Typography from "@material-ui/core/Typography";
import AddCircle from "@material-ui/icons/AddCircle";
import TextField from "@material-ui/core/TextField";
import VerifiedIcon from "@material-ui/icons/CheckSharp";

// component
import "../App.css";
import noImage from "../images/no-img.png";
import Writing_Microblogs from "../Writing_Microblogs";
const MyChip = styled(Chip)({
  margin: 2,
  color: "primary"
});

class user extends Component {
  state = {
    profile: window.location.pathname.split("/").pop(),
    imageUrl: null,
    topics: null,
    following: null // boolean value
  };

  componentDidMount() {
    console.log(this.state.profile);
    axios
      .post("/getUserDetails", {
        handle: this.state.profile
      })
      .then(res => {
        console.log(res.data.userData);
        this.setState({
          imageUrl: res.data.userData.imageUrl,
          topics: res.data.userData.followedTopics
        });
      })
      .catch(err => console.log(err));

    axios
      .get("/getallPostsforUser")
      .then(res => {
        console.log(res.data);
        this.setState({
          posts: res.data
        });
      })
      .catch(err => console.log(err));
  }

  render() {
    let authenticated = this.props.user.authenticated;
    let classes = this.props;

    let profileMarkup = this.state.profile ? (
      <div>
        <Typography variant="h5">
          @{this.state.profile}{" "}
          {this.state.verified ? (
            <VerifiedIcon style={{ fill: "#1397D5" }} />
          ) : null}
        </Typography>
      </div>
    ) : (
      <p>loading username...</p>
    );
    let topicsMarkup = this.state.topics ? (
      this.state.topics.map(
        topic => <MyChip label={topic} key={{ topic }.topic.id} /> // console.log({ topic }.topic.id)
      )
    ) : (
      <p> loading topics...</p>
    );

    let imageMarkup = this.state.imageUrl ? (
      <img src={this.state.imageUrl} height="150" width="150" />
    ) : (
      <img src={noImage} height="150" width="150" />
    );

    let postMarkup = this.state.posts ? (
      this.state.posts.map(post => (
        <Card>
          <CardContent>
            <Typography>
              {this.state.imageUrl ? (
                <img src={this.state.imageUrl} height="250" width="250" />
              ) : (
                <img src={noImage} height="50" width="50" />
              )}
            </Typography>
          </CardContent>
        </Card>
      ))
    ) : (
      <p>My Posts</p>
    );

    return (
      <Grid container spacing={24}>
        <Grid item sm={4} xs={8}>
          {imageMarkup}
          {profileMarkup}
          {topicsMarkup}
          <br />
        </Grid>
        <Grid item sm={4} xs={8}>
          {postMarkup}
        </Grid>
      </Grid>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user
});

user.propTypes = {
  user: PropTypes.object.isRequired
};

export default connect(mapStateToProps)(user);
