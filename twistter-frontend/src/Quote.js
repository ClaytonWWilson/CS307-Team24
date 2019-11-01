import React, { Component } from "react";
import { BrowserRouter as Router } from 'react-router-dom';
import Route from 'react-router-dom/Route';
import axios from 'axios';




class Quote extends Component {

    constructor(props) {
        super(props);
        this.state = {
            value : ''
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSubmit2 = this.handleSubmit2.bind(this);


    }

    handleSubmit() {
        
    }

    handleSubmit2() {

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