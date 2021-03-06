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
  getDirectMessages,
  sendDirectMessage,
  createDirectMessage,
  checkDirectMessagesEnabled,
  toggleDirectMessages,
  getAllHandles,
  getUserDetails,
  getProfileInfo,
  login,
  signup,
  deleteUser,
  updateProfileInfo,
  uploadProfileImage,
  verifyUser,
  unverifyUser,
  getUserHandles,
  addSubscription,
  getSubs,
  removeSub
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

// Returns all direct messages that the user is participating in
app.get("/dms", fbAuth, getDirectMessages);

// Send a message in a DM from one user to another
app.post("/dms/send", fbAuth, sendDirectMessage);

// Create a new DM between two users
app.post("/dms/new", fbAuth, createDirectMessage);

// Checks if the user provided has DMs enabled or not
app.post("/dms/enabled", checkDirectMessagesEnabled);

// Used to toggle DMs on or off for the current user
app.post("/dms/toggle", fbAuth, toggleDirectMessages);

app.get("/getUser", fbAuth, getUserDetails);

app.post("/getUserDetails", fbAuth, getUserDetails);

// Returns a list of all usernames
// Used for searching
app.get("/getAllHandles", fbAuth, getAllHandles);

// Returns all profile data of the currently logged in user
app.get("/getProfileInfo", fbAuth, getProfileInfo);

// Updates the currently logged in user's profile information
app.post("/updateProfileInfo", fbAuth, updateProfileInfo);

// Returns all user data for the logged in user.
// Used when setting the state in Redux.
app.get("/user", fbAuth, getAuthenticatedUser);

// Uploads a profile image
app.post("/user/image", fbAuth, uploadProfileImage);

// Verifies the user sent to the request
// Must be run by the Admin user
app.post("/verifyUser", fbAuth, verifyUser);

// Unverifies the user sent to the request
// Must be run by admin
app.post("/unverifyUser", fbAuth, unverifyUser);

// get user handles with search phase
app.post("/getUserHandles", fbAuth, getUserHandles);

// get user's subscription
app.get("/getSubs", fbAuth, getSubs);

// add user to another user's "following" data field
app.post("/addSubscription", fbAuth, addSubscription);

// remove one subscription
app.post("/removeSub", fbAuth, removeSub);

/*------------------------------------------------------------------*
 *  handlers/post.js                                                *
 *------------------------------------------------------------------*/


const {
  getallPostsforUser,
  getallPosts,
  putPost,
  hidePost, 
  likePost,
  unlikePost,
  getLikes,
  quoteWithPost,
  quoteWithoutPost,
  checkforLikePost,
  getOtherUsersPosts,
  getAlert
} = require("./handlers/post");

app.get("/getallPostsforUser", fbAuth, getallPostsforUser);

app.get("/getallPosts", getallPosts);

//Hides Post
app.post("/hidePost", fbAuth, hidePost);

// Adds one post to the database
app.post("/putPost", fbAuth, putPost);

app.get("/likes", fbAuth, getLikes);
app.get("/like/:postId", fbAuth, likePost);
app.get("/unlike/:postId", fbAuth, unlikePost);
app.get("/checkforLikePost/:postId", fbAuth, checkforLikePost);

app.post("/quoteWithPost/:postId", fbAuth, quoteWithPost);
app.post("/quoteWithoutPost/:postId", fbAuth, quoteWithoutPost);

app.post("/getOtherUsersPosts", fbAuth, getOtherUsersPosts);

app.get("/getAlert", fbAuth, getAlert);

/*------------------------------------------------------------------*
 *  handlers/topic.js                                                *
 *------------------------------------------------------------------*/
const {
  putTopic,
  getAllTopics,
  deleteTopic,
  getUserTopics,
  putNewTopic
} = require("./handlers/topic");

// add topic to database
app.post("/putTopic", fbAuth, putTopic);

// get all topics from database
app.get("/getAllTopics", fbAuth, getAllTopics);

// delete a specific topic
app.post("/deleteTopic", fbAuth, deleteTopic);

// get topic for this user
app.post("/getUserTopics", fbAuth, getUserTopics);

app.post("/putNewTopic", fbAuth, putNewTopic);

exports.api = functions.https.onRequest(app);
