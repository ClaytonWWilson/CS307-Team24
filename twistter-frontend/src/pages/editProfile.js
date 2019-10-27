import React, { Component } from "react";
import axios from "axios";
import PropTypes from "prop-types";
// TODO: Add a read-only '@' in the left side of the handle input
// TODO: Add a cancel button, that takes the user back to their profile page

import noImage from '../images/no-img.png';

// Material-UI stuff
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import withStyles from "@material-ui/core/styles/withStyles";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";
import Tooltip from "@material-ui/core/Tooltip";

// Redux stuff
import { connect } from "react-redux";
import { uploadImage } from "../redux/actions/userActions";

const styles = {
  form: {
    textAlign: "center"
  },
  textField: {
    marginBottom: 30
  },
  pageTitle: {
    // marginTop: 20,
    marginBottom: 40
  },
  button: {
    positon: "relative",
    marginBottom: 30
  },
  box: {
    position: "relative"
  },
  progress: {
    position: "absolute"
  },
  uploadProgress: {
    position: "absolute",
    marginLeft: -155,
    marginTop: 95
  }
};

export class edit extends Component {
  // mapReduxToState = (credentials) => {
  //   this.setState({
  //     imageUrl: credentials.imageUrl ? credentials.imageUrl : noImage,
  //     firstName: credentials.firstName ? credentials.firstName : '',
  //     lastName: credentials.lastName ? credentials.lastName : '',
  //     email: credentials.email ? credentials.email : 'error, email doesn\'t exist',
  //     handle: credentials.handle ? credentials.handle : 'error, handle doesn\'t exist',
  //     bio: credentials.bio ? credentials.bio : ''
  //   });
  // };



  // Runs as soon as the page loads.
  // Sets the default values of all the textboxes to the data
  // that is stored in the database for the user.
  componentDidMount() {
    // const { credentials } = this.props;
    // console.log(this.props.user);
    // this.mapReduxToState(credentials);
    axios
      .get("/getProfileInfo")
      .then((res) => {
        // Need to have the ternary if statements, because react throws an error if
        // any of the res.data keys are undefined
        this.setState({
          imageUrl: res.data.imageUrl,
          firstName: res.data.firstName ? res.data.firstName : "",
          lastName: res.data.lastName ? res.data.lastName : "",
          email: res.data.email,
          handle: res.data.handle,
          bio: res.data.bio ? res.data.bio : ""
        });
      })
      .catch((err) => {
        console.error(err);
        if (err.response.status === 403) {
          alert("You are not logged in");
          // TODO: Redirect them, to the profile they are trying to edit
          // If they are on /itsjimmy/edit, they will be redirected to /itsjimmy
          this.props.history.push('../');
        }
      });
  }

  // Constructor for the state
  constructor() {
    super();
    this.state = {
      imageUrl: "",
      firstName: "",
      lastName: "",
      email: "",
      handle: "",
      bio: "",
      loading: false,
      errors: {}
    };
  }

  // Runs whenever the submit button is clicked.
  // Updates the database entry of the signed in user with the
  // data stored in the state.
  handleSubmit = (event) => {
    event.preventDefault();
    this.setState({
      loading: true
    });
    const newProfileData = {
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      email: this.state.email,
      handle: this.state.handle,
      bio: this.state.bio
    };
    
    // Removes all keys from newProfileData that are empty, undefined, or null
    Object.keys(newProfileData).forEach(key => {
      if (newProfileData[key] === "" || newProfileData[key] === undefined || newProfileData[key] === null) {
        delete newProfileData[key];
      }
    })
      
    axios
      .post("/updateProfileInfo", newProfileData)
      .then((res) => {
        console.log(res);
        this.setState({
          loading: false
        });
        // this.props.history.push('/');
        // TODO: Need to redirect user to their profile page
      })
      .catch((err) => {
        console.log(err);
        // TODO: Should redirect to login page if they get a 403
        this.setState({
          errors: err.response.data,
          loading: false
        });
      });
  };

  // Updates the state whenever one of the textboxes changes.
  // The key is the name of the textbox and the value is the
  // value in the text box.
  // Also sets errors to null of textboxes that have been edited
  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
      errors: {
        [event.target.name]: null
      }
    });
  };

  handleImageChange = (event) => {
    const image = event.target.files[0];
    const formData = new FormData();
    formData.append('image', image, image.name);
    this.props.uploadImage(formData);
  }

  handleEditPicture = () => {
    const fileInput = document.getElementById('imageUpload');
    fileInput.click();
  }

  // logging = () => {
  //   console.log(this.state);
  //   console.log(this.props);
  //   this.mapReduxToState(this.props.credentials);
  // }

  render() {
    const { classes } = this.props;
    const uploading = this.props.UI.loading;
    const { errors, loading } = this.state;

    // let imageMarkup = this.state.imageUrl ? (
    //   <img 
    //   src={this.state.imageUrl}
    //   height="250"
    //   width="250"
    //   />
    // ) : (<img src={noImage}/>);

    let imageMarkup = this.props.user.credentials.imageUrl ? (
      <Box
      // className={classes.box}
      >
        <img
        src={this.props.user.credentials.imageUrl}
        height="250"
        width="250"
        className={classes.box}/>
        {uploading && (
          <CircularProgress size={60} className={classes.uploadProgress} />
        )}
      </Box>
    ) : (
      <Box
      // className={classes.box}
      >
        <img
        src={noImage}
        height="250"
        width="250"
        className={classes.box}/>
        {uploading && (
          <CircularProgress size={60} className={classes.uploadProgress} />
        )}
      </Box>
    )

    return (
      <Grid container className={classes.form}>
        <Grid item sm />
        <Grid item sm>
          <Typography variant="h2" className={classes.pageTitle}>
            Edit Profile
          </Typography>
          <form noValidate onSubmit={this.handleSubmit}>
            {imageMarkup}
            <input type="file" id="imageUpload" onChange={this.handleImageChange} hidden = "hidden"/>
            <Tooltip title="Edit profile picture" placement="top">
            <IconButton onClick={this.handleEditPicture} className="button">
              <EditIcon color="primary"/>
            </IconButton>
            </Tooltip>
            <Grid container className={classes.form} spacing={4}>
              <Grid item sm>
                <TextField
                  id="firstName"
                  name="firstName"
                  label="First Name"
                  className={classes.textField}
                  value={this.state.firstName}
                  helperText={errors.firstName}
                  error={errors.firstName ? true : false}
                  variant="outlined"
                  onChange={this.handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item sm>
                <TextField
                  id="lastName"
                  name="lastName"
                  label="Last Name"
                  className={classes.textField}
                  value={this.state.lastName}
                  helperText={errors.lastname}
                  error={errors.lastName ? true : false}
                  variant="outlined"
                  onChange={this.handleChange}
                  fullWidth
                />
              </Grid>
            </Grid>
            <TextField
              id="email"
              name="email"
              label="Email*"
              className={classes.textField}
              value={this.state.email}
              disabled
              helperText="(disabled)"
              // INFO: These will be uncommented if changing emails is allowed
              // helperText={errors.email}
              // error={errors.email ? true : false}
              variant="outlined"
              onChange={this.handleChange}
              fullWidth
            />
            <TextField
              id="handle"
              name="handle"
              label="Handle*"
              className={classes.textField}
              value={this.state.handle}
              disabled
              helperText="(disabled)"
              // INFO: These will be uncommented if changing usernames is allowed
              // helperText={errors.handle}
              // error={errors.handle ? true : false}
              variant="outlined"
              onChange={this.handleChange}
              fullWidth
            />
            <TextField
              id="bio"
              name="bio"
              label="Bio"
              className={classes.textField}
              value={this.state.bio}
              helperText={errors.bio}
              error={errors.bio ? true : false}
              multiline
              rows="8"
              variant="outlined"
              onChange={this.handleChange}
              fullWidth
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              className={classes.button}
              disabled={loading || uploading}
            >
              Submit
              {loading && (
                <CircularProgress size={30} className={classes.progress} />
              )}
            </Button>
          </form>
        </Grid>
        <Grid item sm />
      </Grid>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.user,
  UI: state.UI,
  // credentials: state.user.credentials
});

const mapActionsToProps = { uploadImage }

edit.propTypes = {
  uploadImage: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired
};

// export default withStyles(styles)(edit);
export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(edit));