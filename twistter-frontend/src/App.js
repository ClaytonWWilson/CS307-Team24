import React, { Component } from 'react';
import logo from './twistter-logo.png';
import { BrowserRouter as Router } from 'react-router-dom';
import Route from 'react-router-dom/Route';
import './App.css';

var validEmail = true;
var validUsername = false;
var validPassword = false;
var passwordsMatch = false;

const emailBlur = () => {
  //var email = document.getElementById("email");

  /*if() {
    validEmail = true;
  }
  else {
    validEmail = false;
    alert("Email is invalid.");
  }*/

  if(validEmail && validUsername && validPassword && passwordsMatch) {
    document.getElementById("submit").disabled = false;
  }
  else {
    document.getElementById("submit").disabled = true;
  }
}

const usernameBlur = () => {
  var username = document.getElementById("username");

  if(username.value.length >= 3 && username.value.length <= 50) {
    validUsername = true;
  }
  else {
    validUsername = false;
    alert("Username must be between 3 and 50 characters long.");
  }

  if(validEmail && validUsername && validPassword && passwordsMatch) {
    document.getElementById("submit").disabled = false;
  }
  else {
    document.getElementById("submit").disabled = true;
  }
}

const passwordBlur = () => {
  var password = document.getElementById("password");

  if(password.value.length >= 8 && password.value.length <= 20) {
    validPassword = true;
  }
  else {
    validPassword = false;
    alert("Password must be between 8 and 20 characters long.");
  }

  if(validEmail && validUsername && validPassword && passwordsMatch) {
    document.getElementById("submit").disabled = false;
  }
  else {
    document.getElementById("submit").disabled = true;
  }
}

const confirmPasswordBlur = () => {
  var password = document.getElementById("password");
  var confirmPassword = document.getElementById("confirmPassword");

  if(password.value === confirmPassword.value) {
    passwordsMatch = true;
  }
  else {
    passwordsMatch = false;
    alert("Passwords must match.");
  }

  if(validEmail && validUsername && validPassword && passwordsMatch) {
    document.getElementById("submit").disabled = false;
  }
  else {
    document.getElementById("submit").disabled = true;
  }
}

class App extends Component {
  render() {
    return (
      <Router>
        <div className="app">
          
          

        
          
          <Route path="/" exact render={
            () => {
              return (
                <div>
                  <div>
                    <img src={logo} className="app-logo" alt="logo" />
                    <br/><br/>
                    <b>Welcome to Twistter!</b> 
                    <br/><br/>
                    <b>See the most interesting topics people are following right now.</b> 
                  </div>

                  <br/><br/><br/><br/>

                  <div>                    
                    <b>Join today or sign in if you already have an account.</b> 
                    <br/><br/>
                    <button class="authButtons register"><a href="/register">Sign up</a></button> 
                    <br/><br/>
                    <button class="authButtons login"><a href="/login">Sign in</a></button>
                  </div>
                </div>
              )
            }
          }/>

          <Route path="/register" exact render={
            () => {
              return (
                <div>
                  <img src={logo} className="app-logo" alt="logo" />
                  <br/><br/>
                  <b>Create your account</b>
                  <br/><br/>
                  <input class="authInput" id="email" placeholder="Email" onBlur={() => emailBlur()}></input>
                  <br/><br/>
                  <input class="authInput" id="username" placeholder="Username" onBlur={() => usernameBlur()}></input>
                  <br/><br/>
                  <input class="authInput" id="password" placeholder="Password" onBlur={() => passwordBlur()}></input>
                  <br/><br/>
                  <input class="authInput" id="confirmPassword" placeholder="Confirm Password" onBlur={() => confirmPasswordBlur()}></input>
                  <br/><br/>
                  <button class="authButtons register" id="submit" onclick="" disabled>Sign up</button>
                </div>
              )
            }
          }/>

          <Route path="/login" exact render={
            () => {
              return (
                <div>
                  <img src={logo} className="app-logo" alt="logo" />
                  <br/><br/>
                  <b>Log in to Twistter</b>
                  <br/><br/>
                  <input class="authInput" placeholder="Username or email"></input>
                  <br/><br/>
                  <input class="authInput" placeholder="Password"></input>
                  <br/><br/>
                  <button class="authButtons register" onclick="">Sign in</button>
                </div>
              )
            }
          }/>

        
        
        
        
        </div>
      </Router>
    );
  }
}

export default App;