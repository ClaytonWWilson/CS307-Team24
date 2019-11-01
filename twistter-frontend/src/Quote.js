import React, { Component } from "react";
import { BrowserRouter as Router } from 'react-router-dom';
import Route from 'react-router-dom/Route';
import axios from 'axios';
import Modal from "react-modal";





class Quote extends Component {

    constructor(props) {
        super(props);
        this.state = {
            post: null
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSubmit2 = this.handleSubmit2.bind(this);


    }

    handleSubmit2() {
        const postId = "AJdhYAE4diocF8UcrHDq";
        const postNoComment = {
            body : ""
        }
        const headers = {
            headers: { 'Content-Type': 'application/json'}
        }
        
        axios.post(`/putPost/${postId}/quote`, postNoComment, headers)
            .then((res) =>{
                alert('Quoting was successful!')
                console.log(res.data);
            })
            .catch((err) => {
                alert('An error occured.');
                console.error(err);
            })
        event.preventDefault();
        
    }

    handleSubmit() {
        const postId = "AJdhYAE4diocF8UcrHDq";
        const postComment = {
            body : ""
        }
        const headers = {
            headers: { 'Content-Type': 'application/json'}
        }
        
        axios
            .post(`/putPost/${postId}/quote`, postComment, headers)
            .then((res) =>{
                alert('Quoting was successful!')
                console.log(res.data);
            })
            .catch((err) => {
                alert('An error occured.');
                console.error(err);
            })
        event.preventDefault();

    }
    render() {
        return(
            <div>
                <button onClick={this.handleSubmit}>Quote with comment</button>
                <button onClick={this.handleSubmit2}>Quote without comment</button>
            </div>
        )
    }
}

export default Quote