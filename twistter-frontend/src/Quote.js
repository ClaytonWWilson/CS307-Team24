import React, { Component } from "react";
import { BrowserRouter as Router } from 'react-router-dom';
import Route from 'react-router-dom/Route';
import axios from 'axios';
import DropdownButton from 'react-bootstrap/DropdownButton'
import Dropdown from 'react-bootstrap/Dropdown'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'



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
            <DropdownButton size="sm" variant="secondary" title="Quote Microblog">
                <Dropdown.Item size="sm" onClick={this.handleSubmit} href="#/with-comment">Quote with comment</Dropdown.Item>
                <Dropdown.Item size="sm" onClick={this.handleSubmit2} href="#/without-comment">Quote without comment</Dropdown.Item>
            </DropdownButton>
        )
    }
}

export default Quote