/* eslint-disable */
import React, { Component } from 'react';

import './App.css';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';

import { BrowserRouter as Router } from 'react-router-dom';
import Route from 'react-router-dom/Route';
import Navbar from './components/layout/NavBar';
import themeObject from './util/theme';

import home from './pages/Home';
import register from './pages/Register';
import login from './pages/Login';
import user from './pages/user';

import writeMicroblog from './Writing_Microblogs.js';
import edit from './pages/edit.js';
import userLine from './Userline.js';

const theme = createMuiTheme(themeObject);

class App extends Component {
  render() {
    return (
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
          <Route exact path="/userline" component={userLine}/>
        </div>

      </Router>
      </MuiThemeProvider>
    );
  }
}

export default App;
