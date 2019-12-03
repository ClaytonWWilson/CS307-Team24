import React, { Component } from "react";
import { Link } from 'react-router-dom';
import axios from "axios";
import PropTypes from "prop-types";
// TODO: Add a read-only '@' in the left side of the handle input

// Material-UI stuff
import Box from "@material-ui/core/Box"
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import Popover from "@material-ui/core/Popover";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import withStyles from "@material-ui/core/styles/withStyles";

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
  // Runs as soon as the page loads.
  // Sets the default values of all the textboxes to the data
  // that is stored in the database for the user.
  componentDidMount() {
    this.setState({pageLoading: true})
    axios
      .get("/getProfileInfo")
      .then((res) => {
        this.setState({
          firstName: res.data.firstName,
          lastName: res.data.lastName,
          email: res.data.email,
          handle: res.data.handle,
          bio: res.data.bio,
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
      firstName: "",
      lastName: "",
      email: "",
      handle: "",
      bio: "",
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
    const { errors, loading } = this.state;

    // Used for the delete button
		const open = Boolean(this.state.anchorEl);
		const id = open ? 'simple-popover' : undefined;

    return (
      this.state.pageLoading ? 
        <CircularProgress size={60} style={{marginTop: "300px"}}></CircularProgress>
      :
        <Grid container className={classes.form} id="container-grid">
          <Grid item sm >
            <Button
              variant="outlined"
              color="primary"
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
                value={this.state.handle}
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

editProfile.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(editProfile);
