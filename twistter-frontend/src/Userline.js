import React, { Component } from "react";
import { BrowserRouter as Router } from 'react-router-dom';
import Route from 'react-router-dom/Route';
import axios from 'axios';
import Box from '@material-ui/core/Box'
import {borders} from '@material-ui/system';
import { sizing } from '@material-ui/system';
var moment = require('moment');



class Userline extends Component {

    constructor(props)
    {
        super(props);
        this.state = {
            microBlogs : [],
            
        }
        
    }

     componentDidMount() {

         axios.get('http://localhost:5001/twistter-e4649/us-central1/api/getallPostsforUser')
            .then(res => {
                const post = res.data;
                this.setState({microBlogs : post})

            })
    }

     render() {
         const sortedPosts = (this.state.microBlogs).sort((a,b) =>
             -a.createdAt.localeCompare(b.createdAt)
         )
                
        return (
            <div>
            <div style={{fontsize: "13px", textAlign: "left", marginLeft: "14px"}}>
                <p>Userline</p>
            </div>
            <Box border={1} width="25%" flex="1" height="auto" m={2} fontSize="13px" textAlign= "left" padding="5px" flexWrap= "wrap" flexDirection= "row" >
                <div style={{flexWrap: "wrap", flex: "1", flexDirection: "row", wordBreak: "break-word"}}>
                <p>
                {sortedPosts.map((microBlog) => <p>Microblog Title: {microBlog.microBlogTitle}
                                                          <br></br>When post was created: {microBlog.createdAt.substring(0,10) + 
                                                          " " + microBlog.createdAt.substring(11,19)}
                                                          <br></br>Number of comments: {microBlog.commentCount}
                                                          <br></br>Number of likes: {microBlog.likeCount}
                                                          <br></br>Body of post: {microBlog.body}
                                                          <br></br>Tagged topics: {microBlog.microBlogTopics.join("," + " ")}               
                </p>)} 
                </p>
                </div>
            </Box>
            </div>
            
                )
        }
        
}
export default Userline;
