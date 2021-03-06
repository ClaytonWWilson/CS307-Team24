import React, { Component } from "react";
// import { BrowserRouter as Router } from "react-router-dom";
// import Route from "react-router-dom/Route";
import axios from "axios";

// Material-UI
import TextField from '@material-ui/core/TextField';
// import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import withStyles from "@material-ui/styles/withStyles";
import CircularProgress from "@material-ui/core/CircularProgress";

const styles = {
  container: {
    position: "fixed"
  },
  form: {
    width: "300px",
    height: "50px",
    marginTop: "180px",
    marginLeft: "50px"
  },
  textField: {
    marginBottom: 15
  },
  progress: {
    position: "absolute"
  },
  button: {
    positon: "relative",
    marginBottom: 30
  }
}

class Writing_Microblogs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "",
      title: "",
      topics: "",
      characterCount: 250,
      loading: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChangeforPost = this.handleChangeforPost.bind(this);
    this.handleChangeforTopics = this.handleChangeforTopics.bind(this);
  }

  handleChange(event) {
    this.setState({ title: event.target.value });
  }

  handleChangeforTopics(event) {
    this.setState({ topics: event.target.value });
  }

  handleSubmit = (event) => {
    // alert('A title for the microblog was inputted: ' + this.state.title + '\nA microblog was posted: ' + this.state.value);
    const postData = {
      body: this.state.value,
      userImage: "bing-url",
      microBlogTitle: this.state.title,
      microBlogTopics: this.state.topics.split(", ")
    };

    this.setState({
      loading: true
    })
    const headers = {
      headers: { "Content-Type": "application/json" }
    };

    let postPromise = axios
      .post("/putPost", postData, headers) // TODO: add topics
      .then(res => {
        // alert("Post was shared successfully!");
        console.log(res.data);
      })
      .catch(err => {
        alert("An error occured.");
        console.error(err);
      });
    console.log(postData.microBlogTopics);
    // let topicPromises = [];
    // postData.microBlogTopics.forEach(topic => {
    //   topicPromises.push(axios
    //     .post("/putTopic", {
    //       following: topic
    //     })
    //     .then(res => {
    //       console.log(res.data);
    //     })
    //     .catch(err => {
    //       console.error(err);
    //     })
    //   )
    // });
    event.preventDefault();
    // topicPromises.push(postPromise);
    Promise.all([postPromise])
      .then(() => {
        this.setState({ 
          value: "", 
          title: "", 
          characterCount: 250, 
          topics: "",
          loading: false
        });
      })
      .catch((error) => {
        console.log(error);
      })
  }

  handleChangeforPost(event) {

    this.setState({ value: event.target.value });
  }

  handleChangeforCharacterCount(event) {
    const charCount = event.target.value.length;
    const charRemaining = 250 - charCount;
    this.setState({ characterCount: charRemaining });
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.container}>
        <form noValidate className={classes.form}>
          <TextField
            id="title"
            name="title"
            label="Title"
            className={classes.textField}
            value={this.state.title}
            variant="outlined"
            onChange={this.handleChange}
            fullWidth
            autoComplete='off'
          />

          <TextField
            id="topics"
            name="topics"
            label="Topics"
            className={classes.textField}
            value={this.state.topics}
            variant="outlined"
            onChange={this.handleChangeforTopics}
            color="primary"
            fullWidth
            autoComplete='off'
          />
          <TextField
            id="content"
            name="content"
            label="Content"
            color="primary"
            className={classes.textField}
            value={this.state.value}
            helperText={`${this.state.characterCount} characters left`}
            multiline
            rows="9"
            variant="outlined"
            inputProps={{
              maxLength: 250
            }}
            onChange={(e) => {
              this.handleChangeforPost(e);
              this.handleChangeforCharacterCount(e);
            }}
            fullWidth
            autoComplete='off'
          />
          <Button
            className={classes.button}
            onClick={this.handleSubmit}
            disabled={this.state.loading}
            variant="outlined"
            color="primary"
            >
              Share Post
            {this.state.loading && <CircularProgress size={30} className={classes.progress} />}
          </Button>
        </form>
      </div>
    );
  }
}

export default withStyles(styles)(Writing_Microblogs);
