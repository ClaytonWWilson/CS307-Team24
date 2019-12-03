import React, { Component } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Route from "react-router-dom/Route";
import axios from "axios";

class Writing_Microblogs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "",
      title: "",
      topics: "",
      characterCount: 250
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

  handleSubmit(event) {
    // alert('A title for the microblog was inputted: ' + this.state.title + '\nA microblog was posted: ' + this.state.value);
    const postData = {
      body: this.state.value,
      userImage: "bing-url",
      microBlogTitle: this.state.title,
      microBlogTopics: this.state.topics.split(", ")
    };
    const headers = {
      headers: { "Content-Type": "application/json" }
    };

    axios
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
    postData.microBlogTopics.forEach(topic => {
      axios
        .post("/putTopic", {
          following: topic
        })
        .then(res => {
          console.log(res.data);
        })
        .catch(err => {
          console.error(err);
        });
    });
    event.preventDefault();
    this.setState({ value: "", title: "", characterCount: 250, topics: "" });
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
    return (
      <div>
        <div
          style={{
            width: "200px",
            height: "50px",
            marginTop: "180px",
            marginLeft: "50px"
          }}
        >
          <form>
            <textarea
              placeholder="Enter Microblog Title"
              value={this.state.title}
              required
              onChange={this.handleChange}
              cols={30}
              rows={1}
            />
          </form>
        </div>
        <div style={{ width: "200px", height: "50px", marginLeft: "50px" }}>
          <form>
            <textarea
              placeholder="Enter topics seperated by a comma"
              value={this.state.topics}
              required
              onChange={this.handleChangeforTopics}
              cols={40}
              rows={1}
            />
          </form>
        </div>

        <div style={{ width: "200px", marginLeft: "50px" }}>
          <form onSubmit={this.handleSubmit}>
            <textarea
              value={this.state.value}
              required
              maxLength="250"
              placeholder="Write Microblog here..."
              onChange={e => {
                this.handleChangeforPost(e);
                this.handleChangeforCharacterCount(e);
              }}
              cols={40}
              rows={20}
            />
            <div style={{ fontSize: "14px", marginRight: "-100px" }}>
              <p2>Characters Left: {this.state.characterCount}</p2>
            </div>
            <div style={{ marginRight: "-100px" }}>
              <button onClick>Share Post</button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default Writing_Microblogs;
