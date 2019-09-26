/* eslint-disable promise/always-return */
const functions = require('firebase-functions');
const app = require('express')();
const FBauth = require('./util/fbAuth');

const cors = require('cors');
app.use(cors());

const { db } = require('./util/admin');

const {
    putPost
} = require('./handlers/post');


const {
    getUserDetails
} = require('./handlers/users');


// post routes
app.post('/putPost', FBauth, putPost);

// users routes
app.get('/getUser/:handle', getUserDetails);

exports.api = functions.https.onRequest(app);