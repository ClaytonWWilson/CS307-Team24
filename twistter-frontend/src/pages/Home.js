/* eslint-disable */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import axios from 'axios';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

// Material UI and React Router
import { makeStyles, styled } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from "@material-ui/core/Typography";

// component
import '../App.css';
import logo from '../images/twistter-logo.png';
import noImage from '../images/no-img.png';
import Writing_Microblogs from '../Writing_Microblogs';

const MyCardContent = styled(CardContent)({
  textAlign: "left"
});

class Home extends Component {
  state = {};

  componentDidMount() {
    axios
      .get("/getFollowedPosts")
      .then(res => {
        console.log(res.data);
        this.setState({
          posts: res.data
        })
      })
      .catch(err => console.log(err));
  }

  render() {
    dayjs.extend(relativeTime);
    let authenticated = this.props.user.authenticated;

    let postMarkup = this.state.posts ? (
      this.state.posts.map(post => 
        <Card>
          <MyCardContent>
            <Typography>
              {
                this.state.imageUrl ? (<img src={this.state.imageUrl} height="50" width="50" />) : 
                                      (<img src={noImage} height="50" width="50"/>)
              }
            </Typography>
            <Typography variant="h7"><b>{post.userHandle}</b></Typography>
            <Typography variant="body2" color={"textSecondary"}>{dayjs(post.createdAt).fromNow()}</Typography>
            <br />
            <Typography variant="body1"><b>{post.microBlogTitle}</b></Typography>
            <Typography variant="body2">{post.body}</Typography>
            <br />
            <Typography variant="body2"><b>Topics:</b> {post.microBlogTopics}</Typography>
            <br />
            <Typography variant="body2" color={"textSecondary"}> Likes {post.likeCount} &nbsp; Shares {post.commentCount} </Typography>
          </MyCardContent>
        </Card>
      )
    ) : (<p>loading posts...</p>);

    return (
      authenticated ?
      <Grid container spacing={16}>
        <Grid item sm={4} xs={8}>
          <Writing_Microblogs />
        </Grid>
        <Grid item sm={4} xs={8}>
          {postMarkup}
        </Grid>
      </Grid> 
      :
      <div>
        <div>
          <img src={logo} className="app-logo" alt="logo" />
          <br/><br/>
          <b>Welcome to Twistter!</b> 
          <br/><br/>
          <b>See the most interesting topics people are following right now.</b> 
        </div>

        <br/><br/><br/><br/>

        <div>                    
          <b>Join today or sign in if you already have an account.</b> 
          <br/><br/>
          <form action="./signup">
            <button className="authButtons signup">Sign up</button> 
          </form>
          <br/>
          <form action="./login">
            <button className="authButtons login">Sign in</button>
          </form>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.user
})

Home.propTypes = {
  user: PropTypes.object.isRequired
}

export default connect(mapStateToProps)(Home);