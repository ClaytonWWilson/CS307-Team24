/* eslint-disable */
import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import axios from "axios";
//import '../App.css';
// Material-UI
import withStyles from "@material-ui/core/styles/withStyles";
import { makeStyles, styled } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import CircularProgress from "@material-ui/core/CircularProgress";

import Chip from "@material-ui/core/Chip";
import Typography from "@material-ui/core/Typography";
import AddCircle from "@material-ui/icons/AddCircle";
import TextField from "@material-ui/core/TextField";
import VerifiedIcon from "@material-ui/icons/CheckSharp";
import Paper from "@material-ui/core/Paper";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import GridListTileBar from "@material-ui/core/GridListTileBar";
import Container from "@material-ui/core/Container";

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
      profile: null,
      imageUrl: null,
      topics: null,
      newTopic: "",
      loading: false
    };
  }

  handleDelete = topic => {
    console.log(topic);
    axios
      .post(`/deleteTopic`, {
        unfollow: topic
      })
      .then(() => {
        let tempTopics = this.state.topics;
        tempTopics.forEach((oldTopic, index) => {
          if (oldTopic === topic) {
            tempTopics.splice(index, 1);
          }
        });
        this.setState({
          topics: tempTopics
        });
      })
      .catch(function(err) {
        console.log(err);
      });
  };

  handleAddCircle = () => {
    axios
      .post("/putTopic", {
        following: this.state.newTopic
      })
      .then(() => {
        let tempTopics = this.state.topics;
        tempTopics.push(this.state.newTopic);
        this.setState({
          topics: tempTopics,
          newTopic: ""
        });
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
    this.setState({loading: true})
    let userPromise = axios
      .get("/user")
      .then(res => {
        this.setState({
          profile: res.data.credentials.handle,
          imageUrl: res.data.credentials.imageUrl,
          verified: res.data.credentials.verified
            ? res.data.credentials.verified
            : false,
          topics: res.data.credentials.followedTopics
        });
      })
      .catch(err => console.log(err));

    let postsPromise = axios
      .get("/getallPostsforUser")
      .then(res => {
        // console.log(res.data);
        this.setState({
          posts: res.data
        });
      })
      .catch(err => console.log(err));

      Promise.all([userPromise, postsPromise])
        .then(() => {
          this.setState({loading: false});
        })
        .catch((error) => {
          console.log(error)
        })
  }

  formatDate(dateString) {
    let newDate = new Date(Date.parse(dateString));
    return newDate.toDateString();
  }

  render() {
    const { classes } = this.props;
    let authenticated = this.props.user.authenticated;

    let profileMarkup = this.state.profile ? (
      <div>
        <Typography variant="h5" className={classes.username}>
          @{this.state.profile}{" "}
          {this.state.verified ? (
            <VerifiedIcon style={{ fill: "#1397D5" }} />
          ) : null}
        </Typography>
      </div>
    ) : (
      <p className={classes.username}>loading username...</p>
    );

    let topicsMarkup = this.state.topics ? (
      this.state.topics.map(
        topic => (
          <MyChip
            label={topic}
            key={topic}
            onDelete={key => this.handleDelete(topic)}
          />
        ) // console.log({ topic }.topic.id)
      )
    ) : (
      <p> loading topics...</p>
    );

    let imageMarkup = this.state.imageUrl ? (
      <img
        className={classes.profileImage}
        src={this.state.imageUrl}
        height="250"
        width="250"
      />
    ) : (
      <img
        className={classes.profileImage}
        src={noImage}
        height="250"
        width="250"
      />
    );

    let postMarkup = this.state.posts ? (
      this.state.posts.map(post => (
        <Card className={classes.card} key={post.postId}>
          <CardContent>
            <Typography>
              {this.state.imageUrl ? (
                <img src={this.state.imageUrl} height="50" width="50" />
              ) : (
                <img src={noImage} height="50" width="50" />
              )}
            </Typography>
            <Typography variant="h6">
              <b>{post.userHandle}</b>
            </Typography>
            <Typography variant="body2" color={"textSecondary"}>
              {this.formatDate(post.createdAt) }
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
              <b>Topics:</b> {post.microBlogTopics.join(", ")}
            </Typography>
            <br />
            <Typography variant="body2" color={"textSecondary"}>
              Likes {post.likeCount}
            </Typography>
          </CardContent>
        </Card>
      ))
    ) : (
      <p>My Posts</p>
    );

    // FIX: This needs to check if user's profile page being displayed
    // is the same as the user who is logged in
    // Can't check for that right now, because this page is always
    // showing the logged in users profile, instead of retreiving the
    // profile based on the URL entered
    let editButtonMarkup = true ? (
      <Link to="/user/edit">
        <Button className={classes.button} variant="outlined" color="primary">
          Edit Profile
        </Button>
      </Link>
    ) : null;

    let verifyButtonMarkup = this.state.profile === "Admin" ?
      <Link to="/verify">
        <Button className={classes.button} variant="outlined" color="primary">
          Verify Users
        </Button>
      </Link>
    :
      null

    return (
      this.state.loading ? <CircularProgress size={60} style={{marginTop: "300px"}}></CircularProgress> :
      <div>
        {/* <Paper className={classes.paper}> */}
        <Grid container direction="column">
          <Grid item>
            <Grid container>
              <Grid item sm>
                {editButtonMarkup}
                {verifyButtonMarkup}
              </Grid>
              <Grid item sm>
                {/* <Grid container direction="column"> */}
                {/* <Grid item sm> */}
                {imageMarkup}
                {profileMarkup}
                {/* </Grid> */}
                {/* <Grid item sm> */}
                {/* {postMarkup} */}
                {/* </Grid> */}
                {/* </Grid> */}
              </Grid>
              <Grid item sm>
                <Container className={classes.topicsContainer} maxWidth="xs">
                  {topicsMarkup}
                </Container>
                <TextField
                  id="newTopic"
                  label="new topic"
                  // defaultValue=""
                  margin="normal"
                  variant="outlined"
                  value={this.state.newTopic}
                  onChange={event => this.handleChange(event)}
                />
                <AddCircle
                  className={classes.addCircle}
                  color="primary"
                  // iconStyle={classes.addCircle}
                  clickable="true"
                  onClick={this.handleAddCircle}
                  cursor="pointer"
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Grid container>
              <Grid item sm />
              <Grid item>{postMarkup}</Grid>
              <Grid item sm />
            </Grid>
          </Grid>
        </Grid>
      </div>
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
