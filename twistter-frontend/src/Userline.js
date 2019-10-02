import React, { Component } from "react";
import { BrowserRouter as Router } from 'react-router-dom';
import Route from 'react-router-dom/Route';
import axios from 'axios';

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
         let sortedPosts = [];
            
        return (
            <ul>
                { this.state.microBlogs.map(microBlog => <p>{microBlog.body}</p>)}
            </ul>
        )
     }
}
export default Userline;
