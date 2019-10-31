import React, { Component } from "react";

import axios from 'axios';
import Box from '@material-ui/core/Box';
//import {connect } from 'react-redux';
//import { likePost, unlikePost } from '../redux/actions/dataActions';
//import PropTypes from 'prop-types';

class Feed extends Component {
    

    
    constructor(props) {
        super(props);
        this.state = {
            microBlogs: []
        };
    }

    componentDidMount() {

        axios.get('/getallPostsforFeed')
           .then(res => {
               const post = res.data;
               this.setState({microBlogs : post})

           })
            
   }

   render() {


    const sortedPosts = (this.state.microBlogs).sort((a,b) =>
    -a.createdAt.localeCompare(b.createdAt)
    )
       return(
        <div>
        <div style={{fontsize: "13px", marginLeft: "30%", textAlign: "left", }}>
            <p>Feed</p>
        </div>
        <Box width="25%" flex="1" height="auto" marginLeft= "30%" m={2} fontSize="13px" padding="5px" flexWrap= "wrap" flexDirection= "row" >

            <div style={{flexWrap: "wrap", flex: "1", flexDirection: "row",  wordBreak: "break-word", textAlign: "left"}}>
            <p>
            {sortedPosts.map((microBlog) => <p>Microblog Title: {microBlog.microBlogTitle}
                                                      <br></br>When post was created: {microBlog.createdAt.substring(0,10) + 
                                                      " " + microBlog.createdAt.substring(11,19)}
                                                      <br></br>Who wrote the microBlog: {microBlog.userHandle}
                                                      <br></br>Body of post: {microBlog.body}
                                                      <br></br>Tagged topics: {microBlog.microBlogTopics.join("," + " ")}
                                                      <br></br><br></br><br></br>
                                                      
                                                      <span>Likes: {microBlog.likeCount}</span><br></br><br></br><br></br><br></br>
                                                                     
            </p>)} 
            </p>
            </div>
            </Box>
        </div>
        
        )
   }
}
/* Feed.propTypes = {
    likePost: PropTypes.func.isRequired,
    unlikePost: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
    post: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    user: state.user
})

const mapActionsToProps = {
    likePost,
    unlikePost
}

export default connect(mapStateToProps, mapActionsToProps)(Feed);  */
export default Feed;