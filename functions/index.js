/* eslint-disable promise/always-return */
const app = require("express")();
const cors = require("cors");
const { db } = require("./util/admin");
const fbAuth = require("./util/fbAuth");
const functions = require("firebase-functions");
app.use(cors());

/*------------------------------------------------------------------*
 *  handlers/users.js                                               *
 *------------------------------------------------------------------*/
const {
  getAuthenticatedUser,
  getUserDetails,
  getProfileInfo,
  login,
  signup,
  deleteUser,
  updateProfileInfo
} = require("./handlers/users");

// Adds a user to the database and registers them in firebase with
// an email and password pair
// Returns a token for the new user
app.post("/signup", signup);

// Returns a token for the user that matches the provided username
// and password
app.post("/login", login);

//Deletes user account
app.delete("/delete", deleteUser);

app.get("/getUser", fbAuth, getUserDetails);

// Returns all profile data of the currently logged in user
app.get("/getProfileInfo", fbAuth, getProfileInfo);

// Updates the currently logged in user's profile information
app.post("/updateProfileInfo", fbAuth, updateProfileInfo);

app.get("/user", fbAuth, getAuthenticatedUser);

/*------------------------------------------------------------------*
 *  handlers/post.js                                                *
 *------------------------------------------------------------------*/
const { getallPostsforUser, putPost, getAllPosts
} = require("./handlers/post");

app.get("/getallPostsforUser", getallPostsforUser);

// Adds one post to the database
app.post("/putPost", fbAuth, putPost);

// Displays posts on home page
app.post("/getAllPosts", getAllPosts );

/*------------------------------------------------------------------*
 *  handlers/topic.js                                                *
 *------------------------------------------------------------------*/
const { putTopic, getAllTopics
} = require("./handlers/topic");

// add topic to database
app.post("/putTopic", fbAuth, putTopic);

// get all topics from database
app.get("/getAllTopics", fbAuth, getAllTopics);

exports.api = functions.https.onRequest(app);
