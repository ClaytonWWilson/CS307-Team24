import React, { Component } from "react";
// import props
import { TextField, Button } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Axios from "axios";

import { BrowserRouter as Router } from "react-router-dom";

export class Search extends Component {
  state = {
    searchPhase: null,
    searchResult: null
  };

  handleSearch = () => {
    console.log(this.state.searchPhase);
    Axios.post("/getUserHandles", {
      userHandle: this.state.searchPhase
    })
      .then(res => {
        console.log(res);

        this.setState({
          searchResult: res.data
        });
      })
      .catch(err => {
        console.log(err);
      });
  };

  handleInput(event) {
    this.setState({
      searchPhase: event.target.value
    });
    console.log(this.state.searchPhase);
  }

  handleRedirect() {
    location.reload();
  }

  render() {
    let resultMarkup = this.state.searchResult ? (
      <Router>
        <div>
          <a href={`/user/${this.state.searchResult}`}>
            {this.state.searchResult}
          </a>
        </div>
      </Router>
    ) : (
      //   console.log(this.state.searchResult)
      <p> No result </p>
    );

    return (
      <Grid>
        <Grid>
          <TextField
            id="standard-required"
            label="Search"
            defaultValue="username"
            margin="normal"
            value={this.state.searchPhase}
            onChange={event => this.handleInput(event)}
          />
        </Grid>
        <Grid>
          <Button color="primary" onClick={this.handleSearch}>
            Search
          </Button>
        </Grid>
        <Grid>{resultMarkup}</Grid>
      </Grid>
    );
  }
}

export default Search;
