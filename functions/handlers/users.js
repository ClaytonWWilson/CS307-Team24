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

  let token, userId;

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
    .then((idToken) => {
      token = idToken;
      const userCred = {
        email: newUser.email,
        handle: newUser.handle,
        createdAt: newUser.createdAt,
        userId,
        followedTopics: [],
        verified: false
      };
      return db.doc(`/users/${newUser.handle}`).set(userCred);
    })
    .then(() => {
      return res.status(201).json({ token });
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

  const emailRegEx = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  // Checks if email/username field is empty
  if (user.email.trim() === "") {
    errors.email = "Email must not be blank.";
  }

  // Checks if password field is empty
  if (user.password.trim() === "") {
    errors.password = "Password must not be blank.";
  }

  // Checks if any of the above two errors were found
  if (Object.keys(errors).length > 0) {
    return res.status(400).json(errors);
  }

  // Email/username field is username since it's not in email format
  if (!user.email.match(emailRegEx)) {
    var userDoc = db.collection("users").doc(`${user.email}`);
    userDoc.get()
    .then(function(doc) {
        if (doc.exists) {
          user.email = doc.data().email;
        }
        else {
          return res.status(403).json({ general: "Invalid credentials. Please try again." });
        }
        return;
    })
    .then(function() {
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
        if (err.code === "auth/user-not-found" || err.code === "auth/invalid-email" || err.code === "auth/wrong-password") {
          return res.status(403).json({ general: "Invalid credentials. Please try again." });
        }
        return res.status(500).json({ error: err.code });
      });
      return;
    })
    .catch(function(err) {
      if(!doc.exists) {
        return res.status(403).json({ general: "Invalid credentials. Please try again." });
      }
      return res.status(500).send(err);
    });
  }
  // Email/username field is username
  else {
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
      if (err.code === "auth/user-not-found" || err.code === "auth/invalid-email" || err.code === "auth/wrong-password") {
        return res
              .status(403)
              .json({ general: "Invalid credentials. Please try again." });
      }
      return res.status(500).json({ error: err.code });
    });
  }
};

//Deletes user account
exports.deleteUser = (req, res) => {
  var currentUser;
  firebase.auth().onAuthStateChanged(function(user) {
    currentUser = user;
    if (currentUser) {
      var post_query = db.collection("posts").where("userHandle", "==", req.user.handle);
      post_query.get()
      .then(function(myPosts) {
        myPosts.forEach(function(doc) {
          doc.ref.delete();
        });
        return;
      })
      .then(function() {
        res.status(200).send("Successfully removed all user's posts from database.");
        return;
      })
      .catch(function(err) {
        res.status(500).send("Failed to remove all user's posts from database.", err);
      });



      db.collection("users").doc(`${req.user.handle}`).delete()
      .then(function() {
        res.status(200).send("Sucessfully removed user from database.");
        return;
      })
      .catch(function(err) {
        res.status(500).send("Failed to remove user from database.", err);
      });


      
      currentUser.delete()
      .then(function() {
        console.log("Successfully deleted user.");
        res.status(200).send("Sucessfully deleted user.");
        return;
      })
      .catch(function(err) {
        console.log("Failed to delete user.", err);
        res.status(500).send("Failed to delete user.");
      });
    } 
    else {
      console.log("Failed to deleter user or cannot get user.");
      res.status(500).send("Failed to deleter user or cannot get user.");
    }
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
  // Data validation
  const { valid, errors, profileData } = validateUpdateProfileInfo(req);
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
  db.doc(`/users/${req.body.handle}`)
    .get()
    .then((doc) => {
      if (doc.exists) {
        userData = doc.data();
        return res.status(200).json({userData});
    } else {
      return res.status(400).json({error: "User not found."})
    }})
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};

exports.getAuthenticatedUser = (req, res) => {
  let credentials = {};
  db.doc(`/users/${req.user.handle}`)
    .get()
    .then((doc) => {
      if (doc.exists) {
        credentials = doc.data();
        return res.status(200).json({credentials});
    } else {
      return res.status(400).json({error: "User not found."})
    }})
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};

// Verifies the user sent to the request
// Must be run by the Admin user
exports.verifyUser = (req, res) => {
  if (req.userData.handle !== "Admin") {
    return res.status(403).json({error: "This must be done as Admin"});
  }

  db.doc(`/users/${req.body.user}`)
    .get()
    .then((doc) => {
      if (doc.exists) {
        let verifiedUser = doc.data();
        verifiedUser.verified = true;
        return db.doc(`/users/${req.body.user}`).set(verifiedUser, {merge: true});
      } else {
        return res.status(400).json({error: `User ${req.body.user} was not found`});
      }
    })
    .then(() => {
      return res.status(201).json({message: `${req.body.user} is now verified`});
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({error: err.code});
    });
}

// Unverifies the user sent to the request
// Must be run by admin
exports.unverifyUser = (req, res) => {
  if (req.userData.handle !== "Admin") {
    return res.status(403).json({error: "This must be done as Admin"});
  }

  db.doc(`/users/${req.body.user}`)
    .get()
    .then((doc) => {
      if (doc.exists) {
        let unverifiedUser = doc.data();
        unverifiedUser.verified = false;
        return db.doc(`/users/${req.body.user}`).set(unverifiedUser, {merge: true});
      } else {
        return res.status(400).json({error: `User ${req.body.user} was not found`});
      }
    })
    .then(() => {
      return res.status(201).json({message: `${req.body.user} is no longer verified`});
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({error: err.code});
    });
}