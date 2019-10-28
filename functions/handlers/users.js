/* eslint-disable promise/catch-or-return */

const { admin, db } = require("../util/admin");
const config = require("../util/config");
const { validateUpdateProfileInfo } = require("../util/validator");

const firebase = require("firebase");
firebase.initializeApp(config);

var handle2Email = new Map();

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

  const noImg = 'no-img.png';

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
        imageUrl: `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${noImg}?alt=media`,
        userId,
        followedTopics: []
      };
      handle2Email.set(userCred.handle, userCred.email);
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
    handle: req.body.handle,
    password: req.body.password
  };

  // Auth validation
  let errors = {};

  const emailRegEx = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  // Email check
  if (user.email.trim() === "") {
    errors.email = "Email must not be blank.";
  }
  else if (!user.email.match(emailRegEx)) {
    user.email = handle2Email.get(user.email);
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
      if (err.code === "auth/wrong-password" || err.code === "auth/invalid-email" || err.code === "auth/user-not-found") {
        return res
          .status(403)
          .json({ general: "Invalid credentials. Please try again." });
      }
      return res.status(500).json({ error: err.code });
    });
};

//Deletes user account
exports.deleteUser = (req, res) => {
  var currentUser;

  firebase.auth().onAuthStateChanged(function(user) {
    currentUser = user;
    if (currentUser) {
      /*db.collection("users").doc(`${currentUser.handle}`).delete()
      .then(function() {
        res.status(200).send("Removed user from database.");
        return;
      })
      .catch(function(err) {
        res.status(500).send("Failed to remove user from database.", err);
      });*/

      //let ref = db.collection('users');
      //let userDoc = ref.where('userId', '==', currentUser.uid).get();
      //userDoc.ref.delete();

      currentUser.delete()
      .then(function() {
        console.log("User successfully deleted.");
        res.status(200).send("Deleted user.");
        return;
      })
      .catch(function(err) {
        console.log("Error deleting user.", err);
        res.status(500).send("Failed to delete user.");
      });
    } 
    else {
      console.log("Cannot get user.");
      res.status(500).send("Cannot get user.");
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
  // TODO: Add functionality for adding/updating profile images

  // Data validation
  const { valid, errors, profileData } = validateUpdateProfileInfo(req);
  if (!valid) return res.status(400).json(errors);

  // Update the database entry for this user
  db.collection("users")
    .doc(req.user.handle)
    .set(profileData)
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

// Returns all data stored for a user
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

// Uploads a profile image
exports.uploadProfileImage = (req, res) => {
  const BusBoy = require("busboy");
  const path = require("path");
  const os = require("os");
  const fs = require("fs");

  const busboy = new BusBoy({ headers: req.headers });

  let imageFileName;
  let imageToBeUploaded = {};
  let oldImageFileName = req.userData.imageUrl.split("/o/")[1].split("?alt")[0];
  console.log(`old file: ${oldImageFileName}`);

  busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
    if (mimetype !== 'image/jpeg' && mimetype !== 'image/png') {
      return res.status(400).json({ error: "Wrong filetype submitted" });
    }
    // console.log(fieldname);
    // console.log(filename);
    // console.log(mimetype);
    const imageExtension = filename.split(".")[filename.split(".").length - 1];       // Get the image file extension
    imageFileName = `${Math.round(Math.random() * 100000000000)}.${imageExtension}`;  // Get a random filename
    const filepath = path.join(os.tmpdir(), imageFileName);
    imageToBeUploaded = { filepath, mimetype };
    file.pipe(fs.createWriteStream(filepath));
  });
  busboy.on("finish", () => {
    admin.storage().bucket().upload(imageToBeUploaded.filepath, {
      resumable: false,
      metadata: {
        metadata: {
          contentType: imageToBeUploaded.mimetype
        }
      }
    })
    .then(() => {
      const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageFileName}?alt=media`;
      return db.doc(`/users/${req.user.handle}`).update({ imageUrl });
    })
    .then(() => {
      if (oldImageFileName !== "no-img.png") {
        admin.storage().bucket().file(oldImageFileName).delete()
          .then(() => {
            return res.status(201).json({ message: "Image uploaded successfully"});
          })
          .catch((err) => {
            console.log(err);
            return res.status(201).json({ message: "Image uploaded successfully"});
          })
      } else {
        return res.status(201).json({ message: "Image uploaded successfully"});
      }

    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: err.code})
    })
  });
  busboy.end(req.rawBody);
}
