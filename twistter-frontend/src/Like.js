import React, { Component } from "react";
import { BrowserRouter as Router } from 'react-router-dom';
import Route from 'react-router-dom/Route';
import axios from 'axios';

class Like extends Component {

    constructor(props) {
        super(props);
        this.state = {
            like : false,
            count : 0
        };


        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit() {
        this.setState({
            like: !this.state.like
          });
          const LikedPost = {
              
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