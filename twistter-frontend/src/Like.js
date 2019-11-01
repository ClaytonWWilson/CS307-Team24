import React, { Component } from "react";
import { BrowserRouter as Router } from 'react-router-dom';
import Route from 'react-router-dom/Route';
import axios from 'axios';

class Like extends Component {

    constructor(props) {
        super(props);
        this.state = {
            like : false,
            Id : null
        };


        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit = post =>  {


        this.setState({
            like: !this.state.like
          });

          axios.get("https://us-central1-twistter-e4649.cloudfunctions.net/api/getallPostsforFeed")
           .then((res) => {
               const postData = res.data;
               this.setState({Id: postData.id})

           })

          if(this.state.like == false)
          {
            
            axios.get(`/putPost/${this.state.Id}/like`)
            .then((res) => {
                console.log(res.data);
            })
          }
          else
          {
          axios.get(`/putPost/${this.state.Id}/unlike`)
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