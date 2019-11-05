/* eslint-disable */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
//import '../App.css';
// Material-UI
import withStyles from '@material-ui/core/styles/withStyles';
import { makeStyles, styled } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import Chip from '@material-ui/core/Chip';
import Typography from '@material-ui/core/Typography';
import AddCircle from '@material-ui/icons/AddCircle';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import Container from '@material-ui/core/Container';

// component
import Userline from '../Userline';
import noImage from '../images/no-img.png';
import Paper from '@material-ui/core/Paper';

const styles = {
  button: {
    positon: 'relative',
    float: 'left',
    marginLeft: 30,
    marginTop: 20
  },
  paper: {
    // marginLeft: "10%",
    // marginRight: "10%"
  },
  profileImage: {
    marginTop: 20
  },
  topicsContainer: {
    border: "lightgray solid 1px",
    marginTop: 20,
    paddingTop: 10,
    paddingBottom: 10,
    height: 300
  },
  addCircle: {
    width: 65,
    height: 65,
    marginTop: 10
  }
};

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
  };

  handleAddCircle = () => {
    axios
      .post('/putTopic', {
        topic: this.state.newTopic
      })
      .then(function() {
        location.reload();
      })
      .catch(function(err) {
        console.log(err);
      });
  };

  handleChange(event) {
    this.setState({
      newTopic: event.target.value
    });
  }

  componentDidMount() {
    axios
      .get('/user')
      .then((res) => {
        this.setState({
          profile: res.data.credentials.handle,
          imageUrl: res.data.credentials.imageUrl
        });
      })
      .catch((err) => console.log(err));
    axios
      .get('/getAllTopics')
      .then((res) => {
        this.setState({
          topics: res.data
        });
      })
      .catch((err) => console.log(err));
  }
  render() {
    const { classes } = this.props;
    let profileMarkup = this.state.profile ? (
      <p>
        <Typography variant="h5">{this.state.profile}</Typography>
      </p>
    ) : (
      <p>loading username...</p>
    );

    let topicsMarkup = this.state.topics ? (
      this.state.topics.map((topic) => (
        <MyChip
          label={{ topic }.topic.topic}
          key={{ topic }.topic.topicId}
          onDelete={(topic) => this.handleDelete(topic)}
        />
      ))
    ) : (
      <p> loading topics...</p>
    );

    let imageMarkup = this.state.imageUrl ? (
      <img className={classes.profileImage} src={this.state.imageUrl} height="250" width="250" />
    ) : (
      <img className={classes.profileImage} src={noImage} />
    );

    // FIX: This needs to check if user's profile page being displayed
    // is the same as the user who is logged in
    // Can't check for that right now, because this page is always
    // showing the logged in users profile, instead of retreiving the
    // profile based on the URL entered
    let editButtonMarkup = true ? (
      <Button className={classes.button} variant="outlined" color="primary">
        Edit Profile
      </Button>
    ) : null;

    return (
      <div>
        {/* <Paper className={classes.paper}> */}

        <Grid container>
          <Grid item sm>
            {editButtonMarkup}
          </Grid>
          <Grid item sm>
            <Grid container direction="column">
              <Grid item sm>
                {imageMarkup}
                {profileMarkup}
              </Grid>
              <Grid item sm>
                <p>posts here</p>
              </Grid>
            </Grid>
          </Grid>
          <Grid item sm>
            <Container
              className={classes.topicsContainer}
              maxWidth="xs">
              {topicsMarkup}
            </Container>
            <TextField
              id="newTopic"
              label="new topic"
              defaultValue=""
              margin="normal"
              variant="outlined"
              value={this.state.newTopic}
              onChange={(event) => this.handleChange(event)}
            />
            <AddCircle
              className={classes.addCircle}
              color="primary"
              // iconStyle={classes.addCircle}
              clickable
              onClick={this.handleAddCircle} />
          </Grid>
        </Grid>
        {/* </Paper> */}

        {/* <GridList>
        <GridListTile key="subheader">
          <p>Posts go here</p>
        </GridListTile>
      </GridList> */}
      </div>
    );
  }
}

// export default user;
export default withStyles(styles)(user);
