/* eslint-disable */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import axios from 'axios';

// Material UI and React Router
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from "@material-ui/core/Typography";

// component
import '../App.css';
import logo from '../images/twistter-logo.png';
import noImage from '../images/no-img.png';
import Writing_Microblogs from '../Writing_Microblogs';
import ReactModal from 'react-modal';


class Home extends Component {
  state = {
    
  };


  componentDidMount() {
    axios
      .get("/getallPosts")
      .then(res => {
        console.log(res.data);
        this.setState({
          posts: res.data
        })
      })
      .catch(err => console.log(err));
  }

  
  render() {
     let authenticated = this.props.user.authenticated;
     let username = this.props.user.credentials.handle;
    let postMarkup = this.state.posts ? (
      this.state.posts.map(post => 
        <Card>
          <CardContent>
            <Typography>
              {
                this.state.imageUrl ? (<img src={this.state.imageUrl} height="250" width="250" />) : 
                                      (<img src={noImage} height="50" width="50"/>)
              }
            </Typography>
            <Typography variant="h7"><b>{post.userHandle}</b></Typography>
            <Typography variant="body2" color={"textSecondary"}>{post.createdAt}</Typography>
            <br />
            <Typography variant="body1"><b>{post.microBlogTitle}</b></Typography>
            <Typography variant="body2">{post.quoteBody}</Typography>
            <br />
            <Typography variant="body2">{post.body}</Typography>
            <br />
            <Typography variant="body2"><b>Topics:</b> {post.microBlogTopics}</Typography>        
            <br />
            {/* <Typography variant="body2" color={"textSecondary"}>Likes {post.likeCount}</Typography> */}
            <Like microBlog = {post.postId} count = {post.likeCount} name = {username}></Like>
            <Quote microblog = {post.postId}></Quote>
          </CardContent>
        </Card>
      )
    ) : (<p>My Posts</p>);

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


class Quote extends Component {
  constructor(props) {
    super(props);
    this.state = {
      characterCount: 250,
      showModal: false,
      value: ""
    }

  this.handleSubmitWithoutPost = this.handleSubmitWithoutPost.bind(this);
  this.handleOpenModal = this.handleOpenModal.bind(this);
  this.handleCloseModal = this.handleCloseModal.bind(this);
  this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmitWithoutPost(event) {
    const post = {
      
      userImage: "bing-url",
    }
    const headers = {
      headers: { "Content-Type": "application/json" }
    };
    axios.post(`/quoteWithoutPost/${this.props.microblog}`, post, headers)
    .then((res) => {
      
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
    this.setState({ showModal: false });
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
      userImage: "bing-url",
    };
    const headers = {
      headers: { "Content-Type": "application/json" }
    };
    axios.post(`/quoteWithPost/${this.props.microblog}`, quotedPost, headers)
    .then((res) => {
      
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
        <button onClick={this.handleOpenModal}>Quote with Post</button>
        <ReactModal 
           isOpen={this.state.showModal}
           style={{content: {height: "50%", width: "25%", marginTop: "auto", marginLeft: "auto", marginRight: "auto", marginBottom : "auto"}}}
        >
          <div style={{ width: "200px", marginLeft: "50px" }}>
          <form>
            <textarea
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
            />
            
            <div style={{ fontSize: "14px", marginRight: "-100px" }}>
              <p2>Characters Left: {this.state.characterCount}</p2>
            </div>
              <button onClick={this.handleSubmit}>Share Quoted Post</button>
        
          <button onClick={this.handleCloseModal}>Cancel</button>

          </form>
        </div>
          
          
        </ReactModal>
        <button onClick={this.handleSubmitWithoutPost}>Quote without Post</button>

      </div>
    )
  }
}

class Like extends Component {

  constructor(props) {
    super(props)
    this.state = {
         num : this.props.count,

    }

    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    this.setState({
      like: localStorage.getItem(this.props.microBlog + this.props.name) === "false"

    })

  }


  
  handleClick(){

    this.setState({
      like: !this.state.like
    }); 
    localStorage.setItem(this.props.microBlog + this.props.name, this.state.like.toString())

    if(this.state.like == false)
          {
            this.setState(() => {
              return {num: this.state.num + 1}
           });
            axios.get(`/like/${this.props.microBlog}`)
            .then((res) => {
                console.log(res.data);
            })
            .catch((err) => {
              console.log(err);
            })
          }
          else
          {
            this.setState(() => {
              return {num: this.state.num - 1}
           });
          axios.get(`/unlike/${this.props.microBlog}`)
                .then((res) => {
                    console.log(res.data);
                })
                .catch((err) => {
                  console.log(err);
                })
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
      
      const label = this.state.like ? 'Unlike' : 'Like'
      return(
        

        <div>
          <Typography variant="body2" color={"textSecondary"}>Likes {this.state.num}</Typography>
          <button onClick={this.handleClick}>{label}</button>
        </div>
      )
    }

}

const mapStateToProps = (state) => ({
  user: state.user
})

Home.propTypes = {
  user: PropTypes.object.isRequired
}

Like.propTypes = {
  user: PropTypes.object.isRequired
}

Quote.propTypes = {
  user: PropTypes.object.isRequired
}

export default connect(mapStateToProps)(Home, Like, Quote);