import React, { Component } from "react";
// import props
// import { TextField, Button } from "@material-ui/core";
import TextField from "@material-ui/core/TextField"
import Grid from "@material-ui/core/Grid";
import axios from "axios";
import Fuse from "fuse.js";

import { BrowserRouter as Router } from "react-router-dom";

import CircularProgress from "@material-ui/core/CircularProgress";

const fuseOptions = {
  shouldSort: true,
  threshold: 0.6,
  location: 0,
  distance: 100,
  maxPatternLength: 32,
  minMatchCharLength: 1,
  keys: []
};

let fuse;


export class Search extends Component {
  state = {
    handles: [],
    // searchPhrase: null,
    searchResult: null,
    loading: false
  };

  componentDidMount() {
    this.setState({loading: true});
    axios.get("/getAllHandles")
    .then((res) => {
      this.setState({
        handles: res.data,
        loading: false
      }, () => {
        // console.log(res.data);
        fuse = new Fuse(this.state.handles, fuseOptions); // "list" is the item array
      })
    })
  }

  // handleSearch = () => {
  //   console.log(this.state.searchPhase);
  //   axios.post("/getUserHandles", {
  //     userHandle: this.state.searchPhase
  //   })
  //     .then(res => {
  //       console.log(res);

  //       this.setState({
  //         searchResult: res.data
  //       });
  //     })
  //     .catch(err => {
  //       console.log(err);
  //     });
  // };

  handleChange = (event) => {
    let result = fuse.search(event.target.value);
    let parsed = [];
    result.forEach((res) => {
      // console.log(res)
      parsed.push(this.state.handles[res])
    })
    this.setState({
      searchResult: parsed.length !== 0 ? parsed : "No Results"
    })
  }

  handleRedirect() {
    location.reload();
  }

  render() {
    let resultMarkup = this.state.searchResult && this.state.searchResult !== "No Results" ? (
      this.state.searchResult.map(res => 
        <Router key={res}>
          <div>
            <a href={`/user/${res}`}>
              {res}
            </a>
          </div>
        </Router>
      )
    ) 
      : 
    this.state.searchResult === "No Results" ?
      (
       <p> No results </p>
      )
        :
      (
        null
      )

    return (

      this.state.loading 
      ? 
        <CircularProgress size={60} style={{marginTop: "300px"}}></CircularProgress> 
      : 
        <Grid>
          <Grid>
            <TextField
              id="standard-required"
              label="Username"
              margin="normal"
              // value={this.state.searchPhrase}
              onChange={this.handleChange}
            />
          </Grid>
          <Grid>
            {/* <Button color="primary" onClick={this.handleSearch}>
              Search
            </Button> */}
          </Grid>
          <Grid>{resultMarkup}</Grid>
        </Grid>
    );
  }
}

export default Search;
