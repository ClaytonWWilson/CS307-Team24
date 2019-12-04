import React, { Component } from "react";
import { Link } from 'react-router-dom';
import axios from "axios";
import PropTypes from "prop-types";

import noImage from '../images/no-img.png';

// Material-UI stuff
import Box from "@material-ui/core/Box"
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import Popover from "@material-ui/core/Popover";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import withStyles from "@material-ui/core/styles/withStyles";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
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
  back: {
    float: "left",
    marginLeft: 15
  },
  delete: {
    float: "right",
    marginRight: 15
  },
  progress: {
    position: "absolute"
  },
  uploadProgress: {
    position: "absolute",
    marginLeft: -155,
    marginTop: 95
  },
  popoverBackground: {
    marginTop: "-100px",
    width: "calc(100vw)",
    height: 'calc(100vh + 100px)',
    backgroundColor: "gray",
    position: "absolute",
    opacity: "70%"
  }
};

export class editProfile extends Component {
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
    this.setState({pageLoading: true})

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
          bio: res.data.bio ? res.data.bio : "",
          dmEnabled: res.data.dmEnabled === false ? false : true,
          pageLoading: false
        });
      })
      .catch((err) => {
        console.error(err);
        if (err.response.status === 403) {
          // This user is not logged in
          this.props.history.push('/');
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
      dmEnabled: false,
      togglingDirectMessages: false,
      anchorEl: null,
      loading: false,
      pageLoading: false,
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
        this.props.history.push('/user');
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

  handleDMSwitch = () => {
    let enable;
    
    if (this.state.dmEnabled) {
      enable = {enable: false};
    } else {
      enable = {enable: true};
    }

    this.setState({
      dmEnabled: enable.enable,
      togglingDirectMessages: true
    });

    axios.post("/dms/toggle", enable)
      .then(() => {
        this.setState({
          togglingDirectMessages: false
        });
      })
  }

  handleImageChange = (event) => {
    if (event.target.files[0]) {
      const image = event.target.files[0];
      const formData = new FormData();
      formData.append('image', image, image.name);
      this.props.uploadImage(formData);
    }
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

  handleOpenConfirmDelete = (event) => {
		this.setState({
      // anchorEl: event.currentTarget
      anchorEl: document.getElementById("container-grid")
		});
	};

	handleCloseConfirmDelete = () => {
		this.setState({
			anchorEl: null,
            createDMUsername: ''
		});
	};

  render() {
    const { classes } = this.props;
    const uploading = this.props.UI.loading;
    const { errors, loading } = this.state;


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

    // Used for the delete button
		const open = Boolean(this.state.anchorEl);
		const id = open ? 'simple-popover' : undefined;

    return (
// <<<<<<< dms
//       <Grid container className={classes.form}>
//         <Grid item sm />
//         <Grid item sm>
//           <Typography variant="h2" className={classes.pageTitle}>
//             Edit Profile
//           </Typography>
//           <form noValidate onSubmit={this.handleSubmit}>
//             <Grid container className={classes.form} spacing={4}>
//               <Grid item sm>
//                 <TextField
//                   id="firstName"
//                   name="firstName"
//                   label="First Name"
//                   className={classes.textField}
//                   value={this.state.firstName}
//                   helperText={errors.firstName}
//                   error={errors.firstName ? true : false}
//                   variant="outlined"
//                   onChange={this.handleChange}
//                   fullWidth
//                 />
//               </Grid>
//               <Grid item sm>
//                 <TextField
//                   id="lastName"
//                   name="lastName"
//                   label="Last Name"
//                   className={classes.textField}
//                   value={this.state.lastName}
//                   helperText={errors.lastname}
//                   error={errors.lastName ? true : false}
//                   variant="outlined"
//                   onChange={this.handleChange}
//                   fullWidth
//                 />
//               </Grid>
//             </Grid>
//             <TextField
//               id="email"
//               name="email"
//               label="Email*"
//               className={classes.textField}
//               value={this.state.email}
//               disabled
//               helperText="(disabled)"
//               // INFO: These will be uncommented if changing emails is allowed
//               // helperText={errors.email}
//               // error={errors.email ? true : false}
//               variant="outlined"
//               onChange={this.handleChange}
//               fullWidth
//             />
//             <TextField
//               id="handle"
//               name="handle"
//               label="Handle*"
//               className={classes.textField}
//               value={this.state.handle}
//               disabled
//               helperText="(disabled)"
//               // INFO: These will be uncommented if changing usernames is allowed
//               // helperText={errors.handle}
//               // error={errors.handle ? true : false}
//               variant="outlined"
//               onChange={this.handleChange}
//               fullWidth
//             />
//             <TextField
//               id="bio"
//               name="bio"
//               label="Bio"
//               className={classes.textField}
//               value={this.state.bio}
//               helperText={errors.bio}
//               error={errors.bio ? true : false}
//               multiline
//               rows="8"
//               variant="outlined"
//               onChange={this.handleChange}
//               fullWidth
//             />
//             <FormControlLabel
//               control={
//                 <Switch
//                   color="primary"
//                   disabled={this.state.togglingDirectMessages} 
//                   checked={this.state.dmEnabled} 
//                   onChange={this.handleDMSwitch} 
//                 />
//               }
//               label="Enable Direct Messages"
//             />
//             <br></br>
//             <Button
//               type="submit"
//               variant="contained"
//               color="primary"
//               className={classes.button}
//               disabled={loading}
//               //component={ Link }
//               //to='/user'
//             >
//               Submit
//               {loading && (
//                 <CircularProgress size={30} className={classes.progress} />
//               )}
//             </Button>
//             <br />
// =======
      this.state.pageLoading ? 
        <CircularProgress size={60} style={{marginTop: "300px"}}></CircularProgress>
      :
        <Grid container className={classes.form} id="container-grid">
          <Grid item sm >
// >>>>>>> master
            <Button
              variant="outlined"
              color="primary"
//               className={classes.button}
              disabled={loading || uploading}
              className={classes.back}
              component={ Link }
              to='/user'
            >
              Back to Profile
            </Button>
          </Grid>
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
              </IconButton></Tooltip>
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
                    autoComplete='off'
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
                    autoComplete='off'
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
                autoComplete='off'
              />
              <TextField
                id="handle"
                name="handle"
                label="Handle*"
                className={classes.textField}
                value={"@" + this.state.handle}
                disabled
                helperText="(disabled)"
                // INFO: These will be uncommented if changing usernames is allowed
                // helperText={errors.handle}
                // error={errors.handle ? true : false}
                variant="outlined"
                onChange={this.handleChange}
                fullWidth
                autoComplete='off'
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
                autoComplete='off'
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                className={classes.button}
                disabled={loading}
                //component={ Link }
                //to='/user'
              >
                Submit
                {loading && (
                  <CircularProgress size={30} className={classes.progress} />
                )}
              </Button>
              
            </form>
          </Grid>
          <Grid item sm>
            <Button
              variant="outlined"
              color="secondary"
              className={classes.delete}
              onClick={this.handleOpenConfirmDelete}
            >
              Delete Account
            </Button>
          </Grid>
          <Box hidden={!Boolean(this.state.anchorEl)} className={classes.popoverBackground}></Box>
          <Popover
              id={id}
              open={open}
              anchorEl={this.state.anchorEl}
              onClose={this.handleCloseConfirmDelete}
              anchorOrigin={{
                vertical: 'center',
                horizontal: 'center'
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'center'
              }}
              style={{
                marginTop: "-200px"
              }}
            >
              <Box
                style={{
                  height: 200,
                  width: 400
                }}
              >
                <Grid container direction="column" spacing={3}>
                  <Grid item>
                      <Typography style={{marginTop: 30, marginLeft: 50, marginRight: 50, textAlign: "center", fontSize: 24}}>Are you sure you want to delete your account?</Typography>
                  </Grid>
                  <Grid item>
                    <Button 
                      color="secondary"
                      variant="contained"
                      component={ Link }
                      to='/delete'
                      style={{
                        marginBottom: "-40px",
                        marginLeft: 10,
                        width: 90
                      }}
                    >
                      Yes
                    </Button>
                    <Button 
                      color="primary"
                      variant="outlined"
                      onClick={this.handleCloseConfirmDelete}
                      style={{
                        marginBottom: "-40px",
                        marginLeft: 195
                      }}
                    >
                      Cancel
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Popover>
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

editProfile.propTypes = {
  uploadImage: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
	user: PropTypes.object.isRequired,
	UI: PropTypes.object.isRequired
};

// export default withStyles(styles)(edit);
export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(editProfile));
