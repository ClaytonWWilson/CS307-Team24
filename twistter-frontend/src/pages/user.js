/* eslint-disable */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import axios from 'axios';
//import '../App.css';

// Material UI and React Router
import { makeStyles, styled } from "@material-ui/core/styles";
import { Link } from 'react-router-dom';
import Card from "@material-ui/core/Card";
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Grid from "@material-ui/core/Grid";

import Chip from "@material-ui/core/Chip";
import Typography from "@material-ui/core/Typography";
import AddCircle from "@material-ui/icons/AddCircle";
import TextField from "@material-ui/core/TextField";

// component
import '../App.css';
import noImage from '../images/no-img.png';
import Writing_Microblogs from '../Writing_Microblogs';
const MyChip = styled(Chip)({
  margin: 2,
  color: "primary"
});

class user extends Component {
  state = {
    profile: null,
    imageUrl: null,
    topics: null,
    newTopic: null
  };

  handleDelete = topic => {
    axios
      .delete(`/deleteTopic/${topic.id}`)
      .then(function() {
        location.reload();
      })
      .catch(function(err) {
        console.log(err);
      });
  };

  handleAddCircle = () => {
    axios
      .post("/putTopic", {
        topic: this.state.newTopic
      })
      .then(function() {
        location.reload();
      })
      .catch(function(err) {
        console.log(err);
      });
  };

  handleChange(event) {
    this.setState({
      newTopic: event.target.value
    });
  }

  componentDidMount() {
    axios
      .get("/user")
      .then(res => {
        this.setState({
          profile: res.data.credentials.handle,
          imageUrl: res.data.credentials.imageUrl
        });
      })
      .catch(err => console.log(err));

    axios
      .get("/getAllTopics")
      .then(res => {
        this.setState({
          topics: res.data
        });
      })
      .catch(err => console.log(err));

    axios
      .get("/getallPostsforUser")
      .then(res => {
        console.log(res.data);
        this.setState({
          posts: res.data
        })
      })
      .catch(err => console.log(err));
  }

  formatDate(dateString) {
    let newDate = new Date(Date.parse(dateString));
    return newDate.toDateString();
  }

  render() {
    let authenticated = this.props.user.authenticated;
    let classes = this.props;
    let profileMarkup = this.state.profile ? (
      <p>
      <Typography variant='h5'>{this.state.profile}</Typography>
      </p>) : (<p>loading username...</p>);
    let topicsMarkup = this.state.topics ? (
      this.state.topics.map(
        topic => (
          <MyChip
            label={{ topic }.topic.topic}
            key={{ topic }.topic.id}
            onDelete={key => this.handleDelete(topic)}
          />
        ) // console.log({ topic }.topic.id)
      )
    ) : (
      <p> loading topics...</p>
    );

    let imageMarkup = this.state.imageUrl ? (<img src={this.state.imageUrl} height="150" width="150" />) : 
                                            (<img src={noImage} height="150" width="150"/>);

    let postMarkup = this.state.posts ? (
      this.state.posts.map(post => 
        <Card>
          <CardContent>
            <Typography>
              {
                this.state.imageUrl ? (<img src={this.state.imageUrl} height="50" width="50" />) : 
                                      (<img src={noImage} height="50" width="50"/>)
              }
            </Typography>
            <Typography variant="h7"><b>{post.userHandle}</b></Typography>
            <Typography variant="body2" color={"textSecondary"}>{this.formatDate(post.createdAt)}</Typography>
            <br />
            <Typography variant="body1"><b>{post.microBlogTitle}</b></Typography>
            <Typography variant="body2">{post.body}</Typography>
            <br />
            <Typography variant="body2"><b>Topics:</b> {post.microBlogTopics}</Typography>
            <br />
            <Typography variant="body2" color={"textSecondary"}>Likes {post.likeCount} Comments {post.commentCount}</Typography>
          </CardContent>
        </Card>
      )
    ) : (<p>My Posts</p>);

    return (
      <Grid container spacing={24}>
        <Grid item sm={4} xs={8}>
          {imageMarkup}
          {profileMarkup}
          {topicsMarkup}
          <TextField
          id="newTopic"
          label="new topic"
          defaultValue=""
          margin="normal"
          variant="outlined"
          value={this.state.newTopic}
          onChange={(event) => this.handleChange(event)}
          />
          <AddCircle
            color="primary"
            clickable
            onClick={this.handleAddCircle}
          />
          <br />
          {authenticated && <Button component={ Link } to='/edit'>Edit Profile Info</Button>}
        </Grid>
        <Grid item sm={4} xs={8}>
          {postMarkup}
        </Grid>
        <Grid item sm={4} xs={8}>
          <Writing_Microblogs />
        </Grid>
              
      </Grid>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.user
})

user.propTypes = {
  user: PropTypes.object.isRequired
}

export default connect(mapStateToProps)(user);
