/* eslint-disable promise/always-return */
const functions = require('firebase-functions');
const app = require('express')();
const cors = require('cors');
app.use(cors());

const FBAuth = require('./util/FBAuth');

/*------------------------------------------------------------------*
 *  handlers/users.js                                               *
 *------------------------------------------------------------------*/
const {getUserDetails, getProfileInfo, updateProfileInfo} = require('./handlers/users');

// Returns all data in the users collection
app.get('/getUser/:handle', getUserDetails);

// Returns all profile data of the currently logged in user
// TODO: Add FBAuth
app.get('/getProfileInfo', getProfileInfo);

// Updates the currently logged in user's profile information
// TODO: Add FBAuth
app.post('/updateProfileInfo', updateProfileInfo);

/*------------------------------------------------------------------*
 *  handlers/post.js                                                *
 *------------------------------------------------------------------*/
const {putPost} = require('./handlers/post');

// Adds one post to the database
app.post('/putPost', FBAuth, putPost);


exports.api = functions.https.onRequest(app);