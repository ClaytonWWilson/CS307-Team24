/* eslint-disable */
import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import axios from "axios";

// Material UI and React Router

import CircularProgress from "@material-ui/core/CircularProgress";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import TextField from "@material-ui/core/TextField";

import Typography from "@material-ui/core/Typography";
import withStyles from "@material-ui/styles/withStyles";

// component
import "../App.css";
import logo from "../images/twistter-logo.png";
import noImage from "../images/no-img.png";
import Writing_Microblogs from "../Writing_Microblogs";
import ReactModal from "react-modal";

// Redux
import { likePost, unlikePost, getLikes } from "../redux/actions/userActions";

const styles = {
  card: {
    marginBottom: 5
  }
};

class Home extends Component {
  state = {
    likes: [],
    loading: false,
    following: null,
    topics: null
  };

  componentDidMount() {
    this.setState({ loading: true });
    let userPromise = axios
      .get("/user")
      .then(res => {
        console.log(res.data.credentials.following);
        let list = [];
        res.data.credentials.following.forEach(element => {
          list.push(element.handle);
        });
        this.setState({
          following: list,
          topics: res.data.credentials.followedTopics
        });
      })
      .catch(err => console.log(err));

    let postPromise = axios
      .get("/getallPosts")
      .then(res => {
        // console.log(res.data);
        this.setState({
          posts: res.data
        });
      })
      .catch(err => console.log(err));

    Promise.all([userPromise, postPromise])
      .then(() => {
        this.setState({
          loading: false
        });
      })
      .catch(error => {
        console.log(error);
      });

    this.props.getLikes();
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      likes: nextProps.user.likes
    });
  }

  handleClickLikeButton = event => {
    // Need the ternary if statement because the user can click on the text or body of the
    // Button and they are two different html elements
    let postId = event.target.dataset.key
      ? event.target.dataset.key
      : event.target.parentNode.dataset.key;
    console.log(postId);

    let doc = document.getElementById(postId);
    // console.log(postId);
    if (this.state.likes.includes(postId)) {
      this.props.unlikePost(postId, this.state.likes);
      doc.dataset.likes--;
    } else {
      this.props.likePost(postId, this.state.likes);
      doc.dataset.likes++;
    }

    doc.innerHTML = "Likes " + doc.dataset.likes;
  };

  formatDate(dateString) {
    let newDate = new Date(Date.parse(dateString));
    return newDate.toDateString();
  }

  render() {
    const {
      UI: { loading }
    } = this.props;
    let authenticated = this.props.user.authenticated;
    let { classes } = this.props;
    let username = this.props.user.credentials.handle;
    console.log(this.state.following);

    let postMarkup = this.state.posts ? (
      this.state.posts.map(post =>
        this.state.following ? (
          this.state.following.includes(post.userHandle) ? (
            <Card className={classes.card} key={post.postId}>
              <CardContent>
                <Typography>
                  {/* {
                this.state.imageUrl ? (<img src={this.state.imageUrl} height="50" width="50" />) : 
                                      (<img src={noImage} height="50" width="50"/>)
              } */}
                  {post.profileImage ? (
                    <img src={post.profileImage} height="50" width="50" />
                  ) : (
                    <img src={noImage} height="50" width="50" />
                  )}
                </Typography>
                <Typography variant="h5">
                  <b>{post.userHandle}</b>
                </Typography>
                <Typography variant="body2" color={"textSecondary"}>
                  {this.formatDate(post.createdAt)}
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
                <Typography
                  id={post.postId}
                  data-likes={post.likeCount}
                  variant="body2"
                  color={"textSecondary"}
                >
                  Likes {post.likeCount}
                </Typography>
                {/* <Like microBlog = {post.postId} count = {post.likeCount} name = {username}></Like> */}
                <Button
                  onClick={this.handleClickLikeButton}
                  data-key={post.postId}
                  disabled={loading}
                  variant="outlined"
                  color="primary"
                >
                  {this.state.likes && this.state.likes.includes(post.postId)
                    ? "Unlike"
                    : "Like"}
                </Button>
                <Quote microblog={post.postId}></Quote>

                {/* <button>Quote</button> */}
              </CardContent>
            </Card>
          ) : (
            <p></p>
          )
        ) : (
          <p></p>
        )
      )
    ) : (
      <p>Loading post...</p>
    );

    return authenticated ? (
      this.state.loading ? (
        <CircularProgress
          size={60}
          style={{ marginTop: "300px" }}
        ></CircularProgress>
      ) : (
        <Grid container>
          <Grid item sm={4} xs={8}>
            <Writing_Microblogs />
          </Grid>
          <Grid item sm={4} xs={8}>
            {postMarkup}
          </Grid>
        </Grid>
      )
    ) : loading ? (
      <CircularProgress
        size={60}
        style={{ marginTop: "300px" }}
      ></CircularProgress>
    ) : (
      <div>
        <div>
          <img src={logo} className="app-logo" alt="logo" />
          <br />
          <br />
          <b>Welcome to Twistter!</b>
          <br />
          <br />
          <b>See the most interesting topics people are following right now.</b>
        </div>

        <br />
        <br />
        <br />
        <br />

        <div>
          <b>Join today or sign in if you already have an account.</b>
          <br />
          <br />
          <form action="./signup">
            <button className="authButtons signup">Sign up</button>
          </form>
          <br />
          <form action="./login">
            <button className="authButtons login">Sign in</button>
          </form>
        </div>
      </div>
    );
  }
}

class Quote extends Component {
  constructor(props) {
    super(props);
    this.state = {
      characterCount: 250,
      showModal: false,
      value: ""
    };

    this.handleSubmitWithoutPost = this.handleSubmitWithoutPost.bind(this);
    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmitWithoutPost(event) {
    const post = {
      userImage: "bing-url"
    };
    const headers = {
      headers: { "Content-Type": "application/json" }
    };
    axios
      .post(`/quoteWithoutPost/${this.props.microblog}`, post, headers)
      .then(res => {
        console.log(res.data);
      })
      .catch(err => {
        console.error(err);
      });
    event.preventDefault();
  }

  handleOpenModal() {
    this.setState({ showModal: true });
  }

  handleCloseModal() {
    this.setState({ showModal: false, characterCount: 250, value: "" });
  }

  handleChangeforPost(event) {
    this.setState({ value: event.target.value });
  }

  handleChangeforCharacterCount(event) {
    const charCount = event.target.value.length;
    const charRemaining = 250 - charCount;
    this.setState({ characterCount: charRemaining });
  }

  handleSubmit(event) {
    const quotedPost = {
      quoteBody: this.state.value,
      userImage: "bing-url"
    };
    const headers = {
      headers: { "Content-Type": "application/json" }
    };
    axios
      .post(`/quoteWithPost/${this.props.microblog}`, quotedPost, headers)
      .then(res => {
        console.log(res.data);
      })
      .catch(err => {
        console.error(err);
      });
    event.preventDefault();
    this.setState({ showModal: false, characterCount: 250, value: "" });
  }

  render() {
    return (
      <div>
        <Button
          variant="outlined"
          color="primary"
          onClick={this.handleOpenModal}
        >
          Quote with Post
        </Button>
        <ReactModal
          isOpen={this.state.showModal}
          style={{
            content: {
              height: "50%",
              width: "25%",
              marginTop: "auto",
              marginLeft: "auto",
              marginRight: "auto",
              marginBottom: "auto"
            }
          }}
        >
          <div style={{ width: "200px", marginLeft: "50px" }}>
            <form style={{ width: "350px" }}>
              {/* <textarea
              value={this.state.value}
              required
              maxLength="250"
              placeholder="Write Quoted Post here..."
              onChange={e => {
                this.handleChangeforPost(e);
                this.handleChangeforCharacterCount(e);
                
              }}
              cols={40}
              rows={20}
            /> */}
              <TextField
                style={{ width: 300 }}
                value={this.state.value}
                label="Write Quoted Post here..."
                required
                multiline
                color="primary"
                rows="14"
                variant="outlined"
                inputProps={{
                  maxLength: 250
                }}
                onChange={e => {
                  this.handleChangeforPost(e);
                  this.handleChangeforCharacterCount(e);
                }}
                autoComplete="off"
              ></TextField>

              <div style={{ fontSize: "14px", marginRight: "-100px" }}>
                <p2>Characters Left: {this.state.characterCount}</p2>
              </div>
              <Button
                variant="outlined"
                color="primary"
                onClick={this.handleSubmit}
              >
                Share Quoted Post
              </Button>

              <Button
                variant="outlined"
                color="primary"
                onClick={this.handleCloseModal}
              >
                Cancel
              </Button>
            </form>
          </div>
        </ReactModal>
        <Button
          variant="outlined"
          color="primary"
          onClick={this.handleSubmitWithoutPost}
        >
          Quote without Post
        </Button>
      </div>
    );
  }
}

class Like extends Component {
  constructor(props) {
    super(props);
    this.state = {
      num: this.props.count
    };

    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    this.setState({
      like:
        localStorage.getItem(this.props.microBlog + this.props.name) === "false"
    });
  }

  handleClick() {
    this.setState({
      like: !this.state.like
    });
    localStorage.setItem(
      this.props.microBlog + this.props.name,
      this.state.like.toString()
    );

    if (this.state.like == false) {
      this.setState(() => {
        return { num: this.state.num + 1 };
      });
      axios
        .get(`/like/${this.props.microBlog}`)
        .then(res => {
          console.log(res.data);
        })
        .catch(err => {
          console.log(err);
        });
    } else {
      this.setState(() => {
        return { num: this.state.num - 1 };
      });
      axios
        .get(`/unlike/${this.props.microBlog}`)
        .then(res => {
          console.log(res.data);
        })
        .catch(err => {
          console.log(err);
        });
    }
  }

  /* componentDidMount() {
    axios.get(`/checkforLikePost/${this.props.microBlog}`)
    .then((res) => {
      this.setState({
        like2: res.data
      })
      console.log(res.data);
    })
    .catch((err) => {
      console.log(err)
    })
    if (this.state.like2 === this.state.like)
    {
      this.setState({
        like: false
      })
    }
  }  */

  render() {
    const label = this.state.like ? "Unlike" : "Like";
    return (
      <div>
        <Typography variant="body2" color={"textSecondary"}>
          Likes {this.state.num}
        </Typography>
        <button onClick={this.handleClick}>{label}</button>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user,
  UI: state.UI
});

const mapActionsToProps = {
  likePost,
  unlikePost,
  getLikes
};

Home.propTypes = {
  user: PropTypes.object.isRequired,
  likePost: PropTypes.func.isRequired,
  unlikePost: PropTypes.func.isRequired,
  getLikes: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  UI: PropTypes.object.isRequired
};

Like.propTypes = {
  user: PropTypes.object.isRequired
};

Quote.propTypes = {
  user: PropTypes.object.isRequired
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(withStyles(styles)(Home, Like, Quote));
