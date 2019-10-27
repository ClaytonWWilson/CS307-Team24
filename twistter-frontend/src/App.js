/* eslint-disable */
import React, { Component } from "react";
import "./App.css";
import axios from "axios";

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Navbar from "./components/layout/NavBar";
import jwtDecode from "jwt-decode";

// Redux
import { Provider } from "react-redux";
import store from "./redux/store";
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import themeObject from './util/theme';
import { SET_AUTHENTICATED } from './redux/types';
import { logoutUser, getUserData } from './redux/actions/userActions';

// Components
import AuthRoute from "./util/AuthRoute";

axios.defaults.baseURL = 'http://localhost:5006/twistter-e4649/us-central1/api';

// Pages
import home from './pages/Home';
import signup from './pages/Signup';
import login from './pages/Login';
import user from './pages/user';
import logout from './pages/Logout';
import Delete from './pages/Delete';
import writeMicroblog from './Writing_Microblogs.js';
import editProfile from './pages/editProfile';
import userLine from './Userline.js';

const theme = createMuiTheme(themeObject);

const token = localStorage.FBIdToken;
if (token) {
  const decodedToken = jwtDecode(token);
  if (decodedToken.exp * 1000 < Date.now()) {
    store.dispatch(logoutUser());
    window.location.href = "/login";
  } else {
    store.dispatch({ type: SET_AUTHENTICATED });
    axios.defaults.headers.common['Authorization'] = token;
    store.dispatch(getUserData());
  }
}


class App extends Component {
  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <Provider store={store}>
          <Router>
            <div className='container' >
              <Navbar />
            </div>

            <div className="app">
              <Switch>
              {/* AuthRoute checks if the user is logged in and if they are it redirects them to /home */}
              <AuthRoute exact path="/signup" component={signup} />
              <AuthRoute exact path="/login" component={login} />
              <Route exact path="/logout" component={logout} />
              <Route exact path="/delete" component={Delete} />

              <Route exact path="/user" component={user} />
              <Route exact path="/home" component={writeMicroblog} />
              <Route exact path="/edit" component={editProfile} />
              {/* <Route exact path="/user" component={userLine} /> */}

              <AuthRoute exact path="/" component={home}/>
              </Switch>
            </div>

          </Router>
        </Provider>
      </MuiThemeProvider>
    );
  }
}

export default App;
