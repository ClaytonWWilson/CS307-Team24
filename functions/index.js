/* eslint-disable promise/always-return */
const functions = require('firebase-functions');
const app = require('express')();
const fbAuth = require('./util/fbAuth');
const {db} = require('./util/admin');
const cors = require('cors');
app.use(cors());


/*------------------------------------------------------------------*
*  handlers/users.js                                               *
*------------------------------------------------------------------*/
const {
    getUserDetails,
    getProfileInfo,
    login,
    signup,
    updateProfileInfo,
} = require('./handlers/users');

app.post('/signup', signup);

app.post('/login', login);

app.get('/getUser/:handle', getUserDetails);

// Returns all profile data of the currently logged in user
app.get('/getProfileInfo', fbAuth, getProfileInfo);

// Updates the currently logged in user's profile information
app.post('/updateProfileInfo', fbAuth, updateProfileInfo);


/*------------------------------------------------------------------*
 *  handlers/post.js                                                *
 *------------------------------------------------------------------*/
const {
    getallPostsforUser,
    putPost,
} = require('./handlers/post');

app.get('/getallPostsforUser', getallPostsforUser);

// Adds one post to the database
app.post('/putPost', fbAuth, putPost);


exports.api = functions.https.onRequest(app);