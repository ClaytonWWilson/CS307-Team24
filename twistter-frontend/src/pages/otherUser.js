/* eslint-disable */
import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import axios from "axios";
//import '../App.css';

// Material UI and React Router
import { makeStyles, styled } from "@material-ui/core/styles";
import withStyles from "@material-ui/core/styles/withStyles";

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
import DoneIcon from "@material-ui/icons/Done";
import CircularProgress from "@material-ui/core/CircularProgress";

// component
import "../App.css";
import noImage from "../images/no-img.png";
import Writing_Microblogs from "../Writing_Microblogs";

const MyChip = styled(Chip)({
  margin: 2,
  color: "primary"
});

const styles = {
  button: {
    positon: "relative",
    float: "left",
    marginLeft: 30,
    marginTop: 20
  },
  paper: {
    // marginLeft: "10%",
    // marginRight: "10%"
  },
  card: {
    marginBottom: 5
  },
  profileImage: {
    marginTop: 20
  },
  topicsContainer: {
    border: "lightgray solid 1px",
    marginTop: 20,
    paddingTop: 10,
    paddingBottom: 10,
    height: 300
  },
  addCircle: {
    width: 65,
    height: 65,
    marginTop: 10
  },
  username: {
    marginBottom: 100
  }
};

class user extends Component {
  constructor() {
    super();
    this.state = {
      profile: window.location.pathname.split("/").pop(),
      imageUrl: null,
      topics: null,
      user: null,
      following: null,
      posts: null,
      myTopics: null,
      loading: false
    };
  }

  handleSub = () => {
    if (this.state.following === true) {
      axios
        .post("/removeSub", {
          unfollow: this.state.profile
        })
        .then(res => {
          console.log("removed sub");
          this.setState({
            following: false
          });
        })
        .catch(function(err) {
          console.log(err);
        });
    } else {
      axios
        .post("/addSubscription", {
          following: this.state.profile
        })
        .then(res => {
          console.log("adding sub");
          this.setState({
            following: true
          });
        })
        .catch(function(err) {
          console.log(err);
        });
    }
  };

  componentDidMount() {
    this.setState({loading: true});
    let otherUserPromise = axios
      .post("/getUserDetails", {
        handle: this.state.profile
      })
      .then(res => {
        this.setState({
          imageUrl: res.data.userData.imageUrl,
          topics: res.data.userData.followedTopics
        });
      })
      .catch(err => console.log(err));

    let userPromise = axios
      .get("/user")
      .then(res => {
        this.setState({
          following: res.data.credentials.following.includes(
            this.state.profile
          ),
          myTopics: res.data.credentials.followedTopics
        });
      })
      .catch(err => console.log(err));

    let posts = axios
      .post("/getOtherUsersPosts", {
        handle: this.state.profile
      })
      .then(res => {
        // console.log(res.data);
        this.setState({
          posts: res.data
        });
      })
      .catch(err => console.log(err));

      Promise.all([otherUserPromise, userPromise, posts])
        .then(() => {
          this.setState({loading: false});
        })
        .catch((error) => {
          console.log(error);
        })
  }

  render() {
    const { classes } = this.props;

    let followMarkup = this.state.following ? (
      <Button variant="contained" color="primary" onClick={this.handleSub}>
        unfollow
      </Button>
    ) : (
      <Button variant="contained" color="primary" onClick={this.handleSub}>
        follow
      </Button>
    );
    let profileMarkup = this.state.profile ? (
      <div>
        <Typography variant="h5">
          @{this.state.profile}{" "}
          {this.state.verified ? (
            <VerifiedIcon style={{ fill: "#1397D5" }} />
          ) : null}
        </Typography>
        {followMarkup}
      </div>
    ) : (
      <p>loading username...</p>
    );

    console.log(this.state.topics);
    console.log(this.state.myTopics);
    let topicsMarkup = this.state.topics ? (
      this.state.topics.map(
        topic =>
          this.state.myTopics ? (
            this.state.myTopics.includes(topic) ? (
              <MyChip
                label={topic}
                key={{ topic }.topic.id}
                onDelete
                deleteIcon={<DoneIcon />}
              />
            ) : (
              <MyChip
                label={topic}
                key={{ topic }.topic.id}
                color="secondary"
              />
            )
          ) : (
            <p></p>
          )
        // topic => <MyChip label={topic} key={{ topic }.topic.id} /> // console.log({ topic }.topic.id)
      )
    ) : (
      <p> no topic yet</p>
    );

    let imageMarkup = this.state.imageUrl ? (
      <img src={this.state.imageUrl} height="150" width="150" />
    ) : (
      <img src={noImage} height="150" width="150" />
    );

    let postMarkup = this.state.posts ? (
      this.state.posts.map(post => (
        <Card className={classes.card}>
          <CardContent>
            <Typography>
              {this.state.imageUrl ? (
                <img src={this.state.imageUrl} height="50" width="50" />
              ) : (
                <img src={noImage} height="50" width="50" />
              )}
            </Typography>
            <Typography variant="h7">
              <b>{post.userHandle}</b>
            </Typography>
            <Typography variant="body2" color={"textSecondary"}>
              {post.createdAt}
            </Typography>

            <br />
            <Typography variant="body1">
              <b>{post.microBlogTitle}</b>
            </Typography>
            <Typography variant="body2">{post.quoteBody}</Typography>

            <br />
            <Typography variant="body2">{post.body}</Typography>
            <br />
            <Typography variant="body2">
              <b>Topics:</b> {post.microBlogTopics}
            </Typography>
            <br />
            <Typography variant="body2" color={"textSecondary"}>
              Likes {post.likeCount}
            </Typography>
          </CardContent>
        </Card>
      ))
    ) : (
      <p>Posts</p>
    );

    return (
      this.state.loading ? <CircularProgress size={60} style={{marginTop: "300px"}}></CircularProgress> :
      <Grid container spacing={24}>
        <Grid item sm={4} xs={8}>
          {imageMarkup}
          {profileMarkup}
          {/* {followMarkup} */}
          {topicsMarkup}
          <br />
        </Grid>
        <Grid item sm={4} xs={8}>
          {postMarkup}
          <br />
        </Grid>
      </Grid>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user
});

user.propTypes = {
  user: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired
};

export default connect(mapStateToProps)(withStyles(styles)(user));
