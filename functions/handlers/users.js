/* eslint-disable promise/catch-or-return */
const { admin, db } = require("../util/admin");
const config = require("../util/config");
const { validateUpdateProfileInfo } = require("../util/validator");

const firebase = require("firebase");
firebase.initializeApp(config);

exports.signup = (req, res) => {
  const newUser = {
    email: req.body.email,
    handle: req.body.handle,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    createdAt: new Date().toISOString()
  };

  let errors = {};

  const emailRegEx = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  // Email check
  if (newUser.email.trim() === "") {
    errors.email = "Email must not be blank.";
  } else if (!newUser.email.match(emailRegEx)) {
    errors.email = "Email is invalid.";
  }

  // handle check
  if (newUser.handle.trim() === "") {
    errors.handle = "Username must not be blank.";
  } else if (newUser.handle.length < 4 || newUser.handle.length > 30) {
    errors.handle = "Username must be between 4-30 characters long.";
  }

  // Password check
  if (newUser.password.trim() === "") {
    errors.password = "Password must not be blank.";
  } else if (newUser.password.length < 8 || newUser.password.length > 20) {
    errors.password = "Password must be between 8-20 characters long.";
  }

  // Confirm password check
  if (newUser.confirmPassword !== newUser.password) {
    errors.confirmPassword = "Passwords must match.";
  }

  // Overall check
  if (Object.keys(errors).length > 0) {
    return res.status(400).json(errors);
  }

  let idToken, userId;

  db.doc(`/users/${newUser.handle}`)
    .get()
    .then((doc) => {
      if (doc.exists) {
        return res
          .status(400)
          .json({ handle: "This username is already taken." });
      }
      return firebase
        .auth()
        .createUserWithEmailAndPassword(newUser.email, newUser.password);
    })
    .then((data) => {
      userId = data.user.uid;
      return data.user.getIdToken();
    })
    .then((token) => {
      idToken = token;
      const userCred = {
        email: req.body.email,
        handle: newUser.handle,
        createdAt: newUser.createdAt,
        userId
      };
      return db.doc(`/users/${newUser.handle}`).set(userCred);
    })
    .then(() => {
      return res.status(201).json({ idToken });
    })
    .catch((err) => {
      console.error(err);
      if (err.code === "auth/email-already-in-use") {
        return res.status(500).json({ email: "This email is already taken." });
      }
      return res.status(500).json({ error: err.code });
    });
};

exports.login = (req, res) => {
  const user = {
    email: req.body.email,
    password: req.body.password
  };

  // Auth validation
  let errors = {};

  // Email check
  if (user.email.trim() === "") {
    errors.email = "Email must not be blank.";
  }

  // Password check
  if (user.password.trim() === "") {
    errors.password = "Password must not be blank.";
  }

  // Checking if any errors have been raised
  if (Object.keys(errors).length > 0) {
    return res.status(400).json(errors);
  }

  firebase
    .auth()
    .signInWithEmailAndPassword(user.email, user.password)
    .then((data) => {
      return data.user.getIdToken();
    })
    .then((token) => {
      return res.status(200).json({ token });
    })
    .catch((err) => {
      console.error(err);
      if (err.code === "auth/wrong-password" || err.code === "auth/invalid-email") {
        return res
          .status(403)
          .json({ general: "Invalid credentials. Please try again." });
      }
      return res.status(500).json({ error: err.code });
    });
};

// Returns all data in the database for the user who is currently signed in
exports.getProfileInfo = (req, res) => {
  db.collection("users")
    .doc(req.user.handle)
    .get()
    .then((data) => {
      return res.status(200).json(data.data());
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json(err);
    });
};

// Updates the data in the database of the user who is currently logged in
exports.updateProfileInfo = (req, res) => {
  // TODO: Add functionality for adding/updating profile images

  // Data validation
  const { valid, errors, profileData } = validateUpdateProfileInfo(req.body);
  if (!valid) return res.status(400).json(errors);

  // Update the database entry for this user
  db.collection("users")
    .doc(req.user.handle)
    .set(profileData, { merge: true })
    .then(() => {
      console.log(`${req.user.handle}'s profile info has been updated.`);
      return res
        .status(201)
        .json({
          general: `${req.user.handle}'s profile info has been updated.`
        });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({
        error: "Error updating profile data"
      });
    });
};

exports.getUserDetails = (req, res) => {
  let userData = {};
  db.doc(`/users/${req.params.handle}`)
    .get()
    .then((doc) => {
      if (doc.exists) {
        userData.user = doc.data();
        return db
          .collection("post")
          .where("userHandle", "==", req.params.handle)
          .orderBy("createdAt", "desc")
          .get();
      } else {
        return res.status(404).json({
          error: "User not found"
        });
      }
    })
    .then((data) => {
      userData.posts = [];
      data.forEach((doc) => {
        userData.posts.push({
          body: doc.data().body,
          createAt: doc.data().createAt,
          userHandle: doc.data().userHandle,
          userImage: doc.data().userImage,
          likeCount: doc.data().likeCount,
          commentCount: doc.data().commentCount,
          postId: doc.id
        });
      });
      return res.json(userData);
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};
