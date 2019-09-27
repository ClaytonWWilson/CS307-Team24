/* eslint-disable promise/always-return */
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const app = require('express')();
admin.initializeApp();
const db = admin.firestore();

const firebaseConfig = {
    apiKey: "AIzaSyCvsWetg4qFdsPGfJ3LCw_QaaYzoan7Q34",
    authDomain: "twistter-e4649.firebaseapp.com",
    databaseURL: "https://twistter-e4649.firebaseio.com",
    projectId: "twistter-e4649",
    storageBucket: "twistter-e4649.appspot.com",
    messagingSenderId: "20131817365",
    appId: "1:20131817365:web:633c95fb08b16d4526b89c"
};

const firebase = require('firebase');
firebase.initializeApp(firebaseConfig);

const isEmpty = (str) => {
    if (str.trim() === '') return true;
    else return false;
}

// Acts as a middleman between the client and any function that you use it with
// The function will only execute if the user is logged in, or rather, they have
// a valid token
const FBAuth = (req, resp, next) => {
    let idToken;

    // Checking that the token exists in the header of the request
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        idToken = req.headers.authorization.split('Bearer ')[1];
    } else {
        console.error('No token found');
        return resp.status(403).json({ error: 'Unauthorized' });
    }

    // Checking that the token is valid in firebase
    admin.auth().verifyIdToken(idToken)
        .then(decodedToken => {
            req.user = decodedToken;
            console.log(decodedToken);
            return db.collection('users')
                .where('userId', '==', req.user.uid)
                .limit(1)
                .get();
        })
        .then(data => {
            req.user.handle = data.docs[0].data().handle;  // Save username
            return next();
        })
        .catch(err => {
            console.error('Error verifying token', err);
            return res.status(403).json(err);
        })
}

app.get('/getUsers', (req, res) => {
    db.collection('users').get().then(data => {
        let users = [];
        data.forEach(doc => {
            users.push(doc.data());
        }); return res.json(users);
    }).catch((err) => console.error(err));
});

app.post('/postUser', (req, res) => {
    const newUser = {
        body: req.body.body
    };
    db.collection('users').add(newUser).then((doc) => {
        res.json({
            message: 'Successfully added!'
        });
    }).catch((err) => {
        res.status(500).json({
            error: 'Error in posting user!'
        });
        console.error(err);
    });
});

// Returns all profile data of the currently logged in user
app.get('/getProfileInfo', (req, res) => {
    // FIXME: Delete this after login is implemented
    req.user = {};
    req.user.handle = 'itsjimmy';

    db.collection('users').doc(req.user.handle).get()
        .then((data) => {
            return res.status(200).json(data.data());
        });
});

// Updates the currently logged in user's profile information
app.post('/updateProfileInfo', (req, res) => {
    // FIXME: Delete this after login is implemented
    req.user = {};
    req.user.handle = 'itsjimmy';

    // TODO: Add functionality for adding/updating profile images

    // ?: Should users be able to change their handles?
    const profileData = {
        firstName: req.body.firstName.trim(),   // Can be empty
        lastName: req.body.lastName.trim(),     // Can be empty
        email: req.body.email.trim(),           // Cannot be empty
        bio: req.body.bio.trim(),               // Can be empty
    };
    
    // Data validation
    let errors = {}

    if (isEmpty(profileData.email)) {
        errors.email = "Must not be empty.";
    }

    // Update the database entry for this user
    db.collection('users').doc(req.user.handle).set(profileData, {merge: true})
        .then((data) =>{
            console.log(`${req.user.handle}'s profile info has been updated.`)
            return res.status(200).json({general: `${req.user.handle}'s profile info has been updated.`});
        })
        .catch((err) => {
            res.status(500).json({
                error: 'Error updating profile data'
            });
            console.error(err);
        })
});

exports.api = functions.https.onRequest(app);