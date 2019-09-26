import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import NavBar from '../components/NavBar';
import ChipsArray from '../components/ChipsArray';

class user extends Component {
  render() {
    return (
      <div className="container">
        <NavBar>
        
        </NavBar>
      </div>
    )
  }
}

//ReactDOM.render(<user />, node);
ReactDOM.render(<ChipsArray />, document.querySelector('#root'));

export default user
