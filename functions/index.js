/* eslint-disable promise/always-return */
const functions = require('firebase-functions');
const app = require('express')();
const cors = require('cors');
app.use(cors());

var config = {
    apiKey: "AIzaSyCvsWetg4qFdsPGfJ3LCw_QaaYzoan7Q34",
    authDomain: "twistter-e4649.firebaseapp.com",
    databaseURL: "https://twistter-e4649.firebaseio.com",
    projectId: "twistter-e4649",
    storageBucket: "twistter-e4649.appspot.com",
    messagingSenderId: "20131817365",
    appId: "1:20131817365:web:633c95fb08b16d4526b89c"
};


const firebase = require('firebase');
firebase.initializeApp(config);

// Acts as a middleman between the client and any function that you use it with
// The function will only execute if the user is logged in, or rather, they have
// a valid token
const firebaseAuth = (req, res, next) => {
    let idToken;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        idToken = req.headers.authorization.split('Bearer ')[1];
    } else {
        console.error('No token found');
        return res.status(403).json({ error: 'Unauthorized' });
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
        req.user.username = data.docs[0].data().username;
        return next();
    })
    .catch(err => {
        console.error("Token verfication failed.", err);
        return res.status(403).json(err);
    });
};

app.post('/scream', firebaseAuth, (req, res) => {
    const newScream = {
        username: req.user.username,
        body: req.body.body,
        numLikes: 0,
        numComments: 0,
        time: new Date().toISOString()
    };

    let invalidCred = {};

    //Body check
    if(req.body.body.trim() === '') {
        invalidCred.body = 'Body must not be blank';
    }

    //Overall check
    if(Object.keys(invalidCred).length > 0) {
        return res.status(400).json(errors);
    }

    db
    .collection('screams')
    .add(newScream)
    .then(doc => {
        res.json({ message: `Document ${doc.id} created successfully!` });
    })
    .catch(err => {
        console.error(err);
        return res.status(500).json({ error: 'Someting went wrong.' });
    });
});

app.get('/screams', (req, res) => {
    db
    .collection('screams')
    .orderBy('time', 'desc')
    .get()
    .then(data => {
        let screams = [];
        data.forEach(doc => {
            screams.push({
                username: doc.data().username,
                body: doc.data().body,
                numLikes: doc.data().numLikes,
                numComments: doc.data().numComments,
                time: doc.data().time,
                screamId: doc.id
            });
        });
        return res.json(screams);
    })
    .catch(err => {
        console.error(err);
        return res.status(500).json({ error: err.code });
    });
});

app.post('/signup', (req, res) => {
    const newUser = {
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        time: new Date().toISOString()
    };

    let invalidCred = {};

    const emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    //Email check
    if(newUser.email.trim() === '') {
        invalidCred.email = 'Email must not be blank.';
    }
    else if(!newUser.email.match(emailRegEx)) {
        invalidCred.email = 'Email is invalid.';
    }

    //Username check
    if(newUser.username.trim() === '') {
        invalidCred.username = 'Username must not be blank.';
    }
    else if(newUser.username.length < 4 || newUser.username.length > 30) {
        invalidCred.username = 'Username must be between 4-30 characters long.';
    }

    //Password check
    if(newUser.password.trim() === '') {
        invalidCred.password = 'Password must not be blank.';
    }
    else if(newUser.password.length < 8 || newUser.password.length > 20) {
        invalidCred.password = 'Password must be between 8-20 characters long.';
    }

    //Confirm password check
    if(newUser.confirmPassword !== newUser.password) {
        invalidCred.confirmPassword = 'Passwords must match.';
    }

    //Overall check
    if(Object.keys(invalidCred).length > 0) {
        return res.status(400).json(errors);
    }
    
    let idToken, userId;

    db.doc(`/users/${newUser.username}`).get()
    .then(doc => {
        if(doc.exists) {
            return res.status(400).json({ username: 'This username is already taken.' });
        }
        return firebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password);
    })
    .then(data => {
        userId = data.user.uid;
        return data.user.getIdToken();
    })
    .then(token => {
        idToken = token;
        const userCred = {
            email: req.body.email,
            username: newUser.username,
            time: newUser.time,
            userId
        }
        return db.doc(`/users/${newUser.username}`).set(userCred);
    })
    .then(() => {
        return res.status(201).json({ idToken });
    })
    .catch(err => {
        console.error(err);
        if(err.code === 'auth/email-already-in-use') {
            return res.status(500).json({ email: 'This email is already taken.' });
        }
        return res.status(500).json({ error: err.code });
    });
});

app.post('/login', (req, res) => {
    const user = {
        email: req.body.email,
        password: req.body.password
    }

    //Auth validation
    let invalidCred = {};

    //Email check
    if(user.email.trim() === '') {
        invalidCred.email = 'Email must not be blank.';
    }

    //Password check
    if(user.password.trim() === '') {
        invalidCred.password = 'Password must not be blank.';
    }

    //Overall check
    if(Object.keys(invalidCred).length > 0) {
        return res.status(400).json(errors);
    }

    firebase.auth().signInWithEmailAndPassword(user.email, user.password)
    .then(data => {
        return data.user.getIdToken();
    })
    .then(token => {
        return res.json({token});
    })
    .catch(err => {
        console.error(err);
        if(err.code === 'auth/wrong-password') {
            return res.status(403).json({ general: 'Invalid credentials. Please try again.' });
        }
        return res.status(500).json({ error: err.code });
    });
});

/*------------------------------------------------------------------*
 *  handlers/users.js                                               *
 *------------------------------------------------------------------*/
const {getUserDetails, getProfileInfo, updateProfileInfo} = require('./handlers/users');

app.get('/getUser/:handle', getUserDetails);

// Returns all profile data of the currently logged in user
// TODO: Add fbAuth
app.get('/getProfileInfo', getProfileInfo);

// Updates the currently logged in user's profile information
// TODO: Add fbAuth
app.post('/updateProfileInfo', updateProfileInfo);

/*------------------------------------------------------------------*
 *  handlers/post.js                                                *
 *------------------------------------------------------------------*/
const {putPost, getallPostsforUser} = require('./handlers/post');

app.get('/getallPostsforUser', getallPostsforUser);

// Adds one post to the database
app.post('/putPost', fbAuth, putPost);


exports.api = functions.https.onRequest(app);