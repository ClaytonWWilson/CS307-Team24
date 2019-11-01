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
  updateProfileInfo,
  verifyUser,
  unverifyUser,
  getUserHandles
} = require("./handlers/users");

// Adds a user to the database and registers them in firebase with
// an email and password pair
// Returns a token for the new user
app.post("/signup", signup);

// Returns a token for the user that matches the provided username
// and password
app.post("/login", login);

//Deletes user account
app.delete("/delete", fbAuth, deleteUser);

app.get("/getUser", fbAuth, getUserDetails);

// Returns all profile data of the currently logged in user
app.get("/getProfileInfo", fbAuth, getProfileInfo);

// Updates the currently logged in user's profile information
app.post("/updateProfileInfo", fbAuth, updateProfileInfo);

app.get("/user", fbAuth, getAuthenticatedUser);

// Verifies the user sent to the request
// Must be run by the Admin user
app.post("/verifyUser", fbAuth, verifyUser);

// Unverifies the user sent to the request
// Must be run by admin
app.post("/unverifyUser", fbAuth, unverifyUser);

// get user handles with search phase
app.get("/getUserHandles", fbAuth, getUserHandles);

/*------------------------------------------------------------------*
 *  handlers/post.js                                                *
 *------------------------------------------------------------------*/
const { getallPostsforUser, getallPosts, putPost } = require("./handlers/post");

app.get("/getallPostsforUser", fbAuth, getallPostsforUser);

app.get("/getallPosts", getallPosts);

// Adds one post to the database
app.post("/putPost", fbAuth, putPost);

/*------------------------------------------------------------------*
 *  handlers/topic.js                                                *
 *------------------------------------------------------------------*/
const { putTopic, getAllTopics, deleteTopic } = require("./handlers/topic");

// add topic to database
app.post("/putTopic", fbAuth, putTopic);

// get all topics from database
app.get("/getAllTopics", fbAuth, getAllTopics);

// delete a specific topic
app.delete("/deleteTopic/:topicId", fbAuth, deleteTopic);

exports.api = functions.https.onRequest(app);
