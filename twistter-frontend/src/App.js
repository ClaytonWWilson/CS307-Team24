/* eslint-disable */
import React, { Component } from "react";
import "./App.css";

import { BrowserRouter as Router } from "react-router-dom";
import Route from "react-router-dom/Route";
import Navbar from "./components/layout/NavBar";
import jwtDecode from "jwt-decode";

// Redux
import { Provider } from "react-redux";
import store from "./redux/store";
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import themeObject from './util/theme';

// Pages
import home from './pages/Home';
import register from './pages/Register';
import login from './pages/Login';
import user from './pages/user';
import writeMicroblog from "./Writing_Microblogs.js";
import edit from "./pages/edit.js";
import userLine from "./Userline.js";

// Components
import AuthRoute from "./util/AuthRoute";

let authenticated;
const token = localStorage.FBIdToken;
if (token) {
  const decodedToken = jwtDecode(token);
  if (decodedToken.exp * 1000 < Date.now()) {
    window.location.href = "/login";
    authenticated = false;
  } else {
    authenticated = true;
  }
}

const theme = createMuiTheme(themeObject);

class App extends Component {
  render() {
    return (
      <Provider store={store}>
      <MuiThemeProvider theme={theme}>
        <Router>
        <div className='container' >
          <Navbar />
        </div>
        <div className="app">
          <Route exact path="/" component={home}/>
          <Route exact path="/register" component={register}/>
          <Route exact path="/login" component={login}/>
          <Route exact path="/user" component={user}/>
          <Route exact path="/home" component={writeMicroblog}/>
          <Route exact path="/edit" component={edit}/>
          <Route exact path="/user" component={userLine}/>
        </div>

      </Router>
      </MuiThemeProvider>
      </Provider>
    );
  }
}

export default App;
