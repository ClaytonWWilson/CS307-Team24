/* eslint-disable */
import React, { Component } from 'react';

import './App.css';

import { BrowserRouter as Router } from 'react-router-dom';
import Route from 'react-router-dom/Route';
import NavBar, { Navbar } from './components/layout/NavBar';

// Pages
import home from './Home.js';
import register from './Register.js';
import login from './Login.js';
import user from './pages/user';
import writeMicroblog from './Writing_Microblogs.js';
import edit from './pages/edit.js';
import userLine from './Userline.js';

class App extends Component {
  render() {
    return (
      <Router>
        <div className='container'>
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
    );
  }
}

export default App;
