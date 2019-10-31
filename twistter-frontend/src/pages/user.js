/* eslint-disable */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
//import '../App.css';
import { makeStyles, styled } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import Chip from '@material-ui/core/Chip';
import Typography from "@material-ui/core/Typography";
import AddCircle from '@material-ui/icons/AddCircle';
import TextField from '@material-ui/core/TextField';
import VerifiedIcon from '@material-ui/icons/CheckSharp';


// component
import Userline from '../Userline';
import noImage from '../images/no-img.png';

const MyChip = styled(Chip)({
  margin: 2,
  color: 'primary'
});

class user extends Component {  
  state = {
    profile: null,
    imageUrl: null,
    topics: null,
    newTopic: null
  };
  
  handleDelete = (topic) => {
    alert(`Delete topic: ${topic}!`);
  }
  
  handleAddCircle = () => {
    axios.post('/putTopic', {
      topic: this.state.newTopic
    })
    .then(function () {
      location.reload();
    })
    .catch(function (err) {
      console.log(err);
    });
  }

  handleChange(event) {
    this.setState({
      newTopic: event.target.value
    })
  }

  componentDidMount() {
    axios
      .get("/user")
      .then(res => {
        this.setState({
          profile: res.data.credentials.handle,
          imageUrl: res.data.credentials.imageUrl,
          verified: res.data.credentials.verified ? res.data.credentials.verified : false
        });
      })
      .catch(err => console.log(err));
    axios
      .get("/getAllTopics")
      .then(res => {
        this.setState({
          topics: res.data
        })
      })
      .catch(err => console.log(err));
  }
  render() {
    const classes = this.props;
    let profileMarkup = this.state.profile ? (
      <div>
        <Typography variant='h5'>{this.state.profile} {this.state.verified ? (<VerifiedIcon style={{fill: "#1397D5"}}/>): (null)}</Typography>
      </div>) : (<p>loading username...</p>);
    

    let topicsMarkup = this.state.topics ? (
      this.state.topics.map(topic => <MyChip 
        label={{topic}.topic.topic}
        key={{topic}.topic.topicId}
        onDelete={ (topic) => this.handleDelete(topic)}/>)
    ) : (<p> loading topics...</p>);

    let imageMarkup = this.state.imageUrl ? (
      <img
      src={this.state.imageUrl}
      height="250"
      width="250"
      />
    ) : (<img src={noImage}/>);

    return (
      <Grid container spacing={16}>
        <Grid item sm={8} xs={12}>
          <p>Post</p>
        </Grid>
        <Grid item sm={4} xs={12}>
          {imageMarkup}
          {profileMarkup}
          {topicsMarkup}
          <TextField
          id="newTopic"
          label="new topic"
          defaultValue=""
          margin="normal"
          variant="outlined"
          value={this.state.newTopic}
          onChange={ (event) => this.handleChange(event)}
          />
          <AddCircle
            color="primary"
            clickable
            onClick={this.handleAddCircle}
          />
        </Grid>
      </Grid>
    );
  }
}

export default user;
