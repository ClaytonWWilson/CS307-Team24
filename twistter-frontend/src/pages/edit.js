import React, { Component } from "react";
import axios from "axios";
import PropTypes from "prop-types";

// Material-UI stuff
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import withStyles from "@material-ui/core/styles/withStyles";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
const styles = {
  form: {
    textAlign: "center"
  },
  textField: {
    marginBottom: 40
  },
  pageTitle: {
    marginTop: 40,
    marginBottom: 40
  }
  // firstName: {
  //     marginRight: 10,
  // },
  // lastname: {
  //     marginLeft: 10,
  // }
  // name: {
  //     width: '40%'
  // }
};

// const classes = useStyles();

export class edit extends Component {
  // profileData = {
  //     firstName: null,
  //     lastName: null,
  //     email: null,
  //     handle: null,
  //     bio: null,
  //     valid: false,
  // };

  componentDidMount() {
    axios
      .get("/getProfileInfo")
      .then(res => {
        // console.log(res.data);
        // this.state.firstName = res.data.firstName;
        // this.state.lastName = res.data.lastName;
        // this.state.email = res.data.email;
        // this.state.handle = res.data.handle;
        // this.state.bio = res.data.bio;
        // this.state.valid = true;
        this.setState({
          firstName: res.data.firstName,
          lastName: res.data.lastName,
          email: res.data.email,
          handle: res.data.handle,
          bio: res.data.bio
        });
      })
      .catch(err => {
        console.error(err);
      });
  }

  constructor() {
    super();
    this.state = {
      firstName: "",
      lastName: "",
      email: "",
      handle: "",
      bio: "",
      loading: false,
      errors: {}
    };
  }

  handleSubmit = (event) => {
    event.preventDefault();
    this.setState({
        loading: true,
    });
    const newProfileData = {
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        email: this.state.email,
        handle: this.state.handle,
        bio: this.state.bio,
    }
    axios.post('updateProfileInfo', newProfileData)
        .then((res) => {
            this.setState({
                loading: false,
            });
            // this.props.history.push('/');
        })
        .catch((err) => {
            this.setState({
                errors: err.response.data,
                loading: false,
            });
        })
  };

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  render() {
    const { classes } = this.props;
    const { errors, loading } = this.state; 
    // let editProfileMarkup = this.state.profileData ? (
    //     // this.state.profileData.map(profileData => <p>{profileData}</p>)
    //     <div>

    //         <p>{this.state.profileData.firstName}</p>
    //         <p>{this.state.profileData.lastName}</p>
    //         <p>{this.state.profileData.email}</p>
    //         <p>{this.state.profileData.bio}</p>
    //     </div>
    // ) : <p>Loading...</p>
    return (
      <Grid container className={classes.form}>
        <Grid item sm />
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
                  variant="outlined"
                  onChange={this.handleChange}
                  fullWidth
                />
              </Grid>
            </Grid>
            <TextField
              id="email"
              name="email"
              label="Email"
              className={classes.textField}
              value={this.state.email}
              disabled
              helperText="(disabled)"
              variant="outlined"
              onChange={this.handleChange}
              fullWidth
            />
            <TextField
              id="handle"
              name="handle"
              label="Handle"
              className={classes.textField}
              value={this.state.handle}
              disabled
              helperText="(disabled)"
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
            >
              Submit
            </Button>
          </form>
        </Grid>
        <Grid item sm />
      </Grid>
    );
  }
}

edit.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(edit);
