import React, { Component } from "react";
// import props
import { TextField, Paper } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Axios from "axios";
import user from "./user.js";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch
} from "react-router-dom";

export class Search extends Component {
  state = {
    searchPhase: null,
    searchResult: null
  };

  handleSearch(event) {
    Axios.get("/getUserHandles").then(res => {
      this.setState({
        searchResult: res.data
      });
    });
    console.log(this.state.searchPhase);
  }

  handleInput(event) {
    this.setState({
      searchPhase: event.target.value
    });
    this.handleSearch();
  }

  handleRedirect() {
    location.reload();
  }

  render() {
    let resultMarkup = this.state.searchResult ? (
      this.state.searchResult.map(result => (
        <Router>
          <div>
            <Link to={`/user`}>{result}</Link>
          </div>
        </Router>
      ))
    ) : (
      //   console.log(this.state.searchResult)
      <p> searching... </p>
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
        <Grid>{resultMarkup}</Grid>
      </Grid>
    );
  }
}

export default Search;
