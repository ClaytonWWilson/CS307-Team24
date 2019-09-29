/* eslint-disable promise/always-return */
const functions = require('firebase-functions');
const app = require('express')();

const FBAuth = require('./util/FBAuth');

/*------------------------------------------------------------------*
 *  users.js                                                        *
 *------------------------------------------------------------------*/

const {getProfileInfo, updateProfileInfo} = require('./handlers/users');

// Returns all profile data of the currently logged in user
// TODO: Add FBAuth
app.get('/getProfileInfo', getProfileInfo);

// Updates the currently logged in user's profile information
// TODO: Add FBAuth
app.post('/updateProfileInfo', updateProfileInfo);


exports.api = functions.https.onRequest(app);