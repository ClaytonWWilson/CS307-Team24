import React, { Component } from "react";
import { BrowserRouter as Router } from 'react-router-dom';
import Route from 'react-router-dom/Route';
import axios from 'axios';

class Like extends Component {

    constructor(props) {
        super(props);
        this.state = {
            like : false,
            
        };


        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(){


        this.setState({
            like: !this.state.like
          });

          
            const postId = "AJdhYAE4diocF8UcrHDq"

          if(this.state.like == false)
          {
            axios.get(`/putPost/${postId}/like`)
            .then((res) => {
                console.log(res.data);
            })
          }
          else
          {
          axios.get(`/putPost/${postId}/unlike`)
                .then((res) => {
                    console.log(res.data);
                })
            } 

    }

    render() {
        const label = this.state.like ? 'Unlike' : 'Like'
        return (
            <button onClick = {{backgroundColor: "lightBlue" }} onClick={this.handleSubmit}>{label}</button>
        )
    }
}

export default Like;