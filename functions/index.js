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

// Acts as a middleman between the client and any function that you use it with
// The function will only execute if the user is logged in, or rather, they have
// a valid token
const FBAuth = (req, resp, next) => {
    let idToken;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        idToken = req.headers.authorization.split('Bearer ')[1];
    } else {
        console.error('No token found');
        return resp.status(403).json({ error: 'Unauthorized' });
    }

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
            req.user.handle = data.docs[0].data().handle;
            return next();
        })
        .catch(err => {
            console.error('Error verifying token', err);
            return res.status(403).json(err);
        })
}

app.get('/getUsers', (req, res) => {
    admin.firestore().collection('users').get().then(data => {
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
    admin.firestore().collection('users').add(newUser).then((doc) => {
        res.json({
            message: 'Successfully added!'
        });
    }).catch((err) => {
        res.status(500).json({
            error: "Error in posting user!"
        });
        console.error(err);
    });
});

exports.api = functions.https.onRequest(app);