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
    .then(doc => {
      if (doc.exists) {
        return res
          .status(400)
          .json({ handle: "This username is already taken." });
      }
      return firebase
        .auth()
        .createUserWithEmailAndPassword(newUser.email, newUser.password);
    })
    .then(data => {
      userId = data.user.uid;
      return data.user.getIdToken();
    })
    .then(idToken => {
      token = idToken;
      const defaultImageUrl = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/no-img.png?alt=media`;
      const userCred = {
        email: newUser.email,
        handle: newUser.handle,
        createdAt: newUser.createdAt,
        userId,
        followedTopics: [],
        imageUrl: defaultImageUrl,
        verified: false
      };
      return db.doc(`/users/${newUser.handle}`).set(userCred);
    })
    .then(() => {
      return res.status(201).json({ token });
    })
    .catch(err => {
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
    userDoc
      .get()
      .then(function(doc) {
        if (doc.exists) {
          user.email = doc.data().email;
        } else {
          return res
            .status(403)
            .json({ general: "Invalid credentials. Please try again." });
        }
        return;
      })
      .then(function() {
        firebase
          .auth()
          .signInWithEmailAndPassword(user.email, user.password)
          .then(data => {
            return data.user.getIdToken();
          })
          .then(token => {
            return res.status(200).json({ token });
          })
          .catch(err => {
            console.error(err);
            if (
              err.code === "auth/user-not-found" ||
              err.code === "auth/invalid-email" ||
              err.code === "auth/wrong-password"
            ) {
              return res
                .status(403)
                .json({ general: "Invalid credentials. Please try again." });
            }
            return res.status(500).json({ error: err.code });
          });
        return;
      })
      .catch(function(err) {
        if (!doc.exists) {
          return res
            .status(403)
            .json({ general: "Invalid credentials. Please try again." });
        }
        return res.status(500).send(err);
      });
  }
  // Email/username field is username
  else {
    firebase
      .auth()
      .signInWithEmailAndPassword(user.email, user.password)
      .then(data => {
        return data.user.getIdToken();
      })
      .then(token => {
        return res.status(200).json({ token });
      })
      .catch(err => {
        console.error(err);
        if (
          err.code === "auth/user-not-found" ||
          err.code === "auth/invalid-email" ||
          err.code === "auth/wrong-password"
        ) {
          return res
            .status(403)
            .json({ general: "Invalid credentials. Please try again." });
        }
        return res.status(500).json({ error: err.code });
      });
  }
};

//Deletes user account and all associated data
exports.deleteUser = (req, res) => {
  // Get the profile image filename
  // `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageFileName}?alt=media`
  let imageFileName;
  req.userData.imageUrl ? 
  imageFileName = req.userData.imageUrl.split('/o/')[1].split('?alt=')[0] : 
  imageFileName = 'no-img.png'
  
  const userId = req.userData.userId;
  let errors = {};

  function thenFunction(data) {
    console.log(`${data} data for ${req.userData.handle} has been deleted.`);
  }

  function catchFunction(data, err) {
    console.error(err);
    errors[data] = err;
  }

  // Deletes user from authentication
  let auth = admin.auth().deleteUser(userId);

  // Deletes database data
  let data = db.collection("users").doc(`${req.user.handle}`).delete();

  // Deletes any custom profile image
  let image;
  if (imageFileName !== 'no-img.png') {
    image = admin.storage().bucket().file(imageFileName).delete()
  } else {
    image = Promise.resolve();
  }

  // Deletes all users posts
  let posts = db.collection("posts")
    .where("userHandle", "==", req.user.handle)
    .get()
    .then((query) => {
      query.forEach((snap) => {
        snap.ref.delete();
      });
      return;
    })

  let promises = [
    auth
      .then(thenFunction('auth'))
      .catch((err) => catchFunction('auth', err)), 
    data
      .then(thenFunction('data'))
      .catch((err) => catchFunction('data', err)),
    image
      .then(thenFunction('image'))
      .catch((err) => catchFunction('image', err)),
    posts
      .then(thenFunction('posts'))
      .catch((err) => catchFunction('image', err))
  ];


  // Wait for all promises to resolve
  let waitPromise = Promise.all(promises);

  waitPromise.then(() => {
    if (Object.keys(errors) > 0) {
      return res.status(500).json(errors);
    } else {
      return res.status(200).json({message: `All data for ${req.userData.handle} has been deleted.`});
    }
  })
  .catch((err) => {
    return res.status(500).json({error: err});
  })
};

// Returns all data in the database for the user who is currently signed in
exports.getProfileInfo = (req, res) => {
  db.collection("users")
    .doc(req.user.handle)
    .get()
    .then(data => {
      return res.status(200).json(data.data());
    })
    .catch(err => {
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
      return res.status(201).json({
        general: `${req.user.handle}'s profile info has been updated.`
      });
    })
    .catch(err => {
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
    .then(doc => {
      if (doc.exists) {
        userData = doc.data();
        return res.status(200).json({ userData });
      } else {
        return res.status(400).json({ error: "User not found." });
      }
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};

exports.getAuthenticatedUser = (req, res) => {
  let credentials = {};
  db.doc(`/users/${req.user.handle}`)
    .get()
    .then(doc => {
      if (doc.exists) {
        credentials = doc.data();
        return res.status(200).json({ credentials });
      } else {
        return res.status(400).json({ error: "User not found." });
      }
    })
    .catch(err => {
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

// Returns all the DMs that the user is currently participating in
exports.getDirectMessages = (req, res) => {
/* Return value
 * data: [DMs]
 *   dm : {
 *     dmId: str
 *     messages: [msgs]
 *       msg: {
 *         author: str
 *         createdAt: ISOString
 *         message: str
 *         messageId: str
 *       }
 *     recipient: str
 *     recentMessage: str
 *     recentMessageTimestamp: ISOString
 *   }
 */

  // Returns all the messages in a dm documentSnapshot
  function getMessages(dm) {
    let promise = new Promise((resolve, reject) => {
      let messagesCollection = dm.collection('messages');

      // Check integrity of messages collection
      if (messagesCollection === null) return res.status(500).json({error: `DM document ${dm.id} is missing a messages collection`})
      let msgs = [];
      let promises = [];

      // Get all of the messages in the DM sorted by when they were created
      messagesCollection.orderBy('createdAt', 'desc').get()
        .then((dmQuerySnap) => {
          dmQuerySnap.forEach((dmQueryDocSnap) => {
            promises.push(
              dmQueryDocSnap.ref.get()
                .then((messageData) => {
                  msgs.push(messageData.data());
                  return
                })
            )
          })

          let waitPromise = Promise.all(promises);
          waitPromise.then(() => {
            resolve(msgs)
          });
        })
    });
    return promise;
  }


  const dms = req.userData.dms;

  // Return null if this user has no DMs
  if (dms === null) return res.status(200).json({data: null});

  let dmsData = [];
  let dmPromises = [];

  dms.forEach((dm) => {
    let dmData = {};
    // Make a new promise for each DM document
    dmPromises.push(new Promise((resolve, reject) => {
      dm  // DM document reference
      .get()
      .then((doc) => {
        let docData = doc.data();

        // Recipient is the person you are messaging
        docData.authors[0] === req.userData.handle ?
          dmData.recipient = docData.authors[1] :
          dmData.recipient = docData.authors[0]

        // Get all the messages from this dm document
        getMessages(dm)
          .then((msgs) => {
            dmData.messages = msgs;
            dmData.recentMessage = msgs[0] ? msgs[0].message : null;
            dmData.recentMessageTimestamp = msgs[0] ? msgs[0].createdAt : null;
            dmData.dmId = doc.id;
            resolve(dmData);
          })
        
        
      
      }).catch((err) => {
        console.err(err);
        return res.status(400).json({error: {
          message: "An error occurred when reading the DM document reference",
          error: err
        }});
      })
    }).then((dmData) => {
      dmsData.push(dmData);
    })
    )
    
  })

  // Wait for all DM document promises to resolve before returning data
  dmWaitPromise = Promise.all(dmPromises)
    .then(() => {
      // Sort the DMs so that the ones with the newest messages are at the top
      dmsData.sort((a, b) => {
        return (b.recentMessageTimestamp < a.recentMessageTimestamp) ? -1 : ((b.recentMessageTimestamp > a.recentMessageTimestamp) ? 1 : 0);
      });
      return res.status(200).json({data: dmsData})
    })
    .catch((err) => {
      return res.status(500).json({error:{
        message: "An error occurred while sorting",
        error: err
      }});
    });
}

// Returns a promise that resolves if user has DMs enabled
// and rejects if there is an error or DMs are disabled
isDirectMessageEnabled = (username) => {
  return new Promise((resolve, reject) => {
    let result = {};
    result.code = null;
    result.message = null;
    if (username === null || username === undefined || username === "") {
      result.code = 400;
      result.message = "No user was sent in the request. The request should have a non-empty 'user' key.";
      reject(result);
    }

    db.doc(`/users/${username}`)
      .get()
      .then((doc) => {
        if (doc.exists) {
          console.log(doc.data())
          if (doc.data().dmEnabled === true || doc.data().dmEnabled === null || doc.data().dmEnabled === undefined) {
            // Assume DMs are enabled if they don't have a dmEnabled key
            resolve(result);
          } else {
            result.code = 0;
            reject(result);
          }
        } else {
          console.log(`${username} is not in the database`);
          result.code = 400;
          result.message = `${username} is not in the database`;
          reject(result);
        }
      })
      .catch((err) => {
        console.log("HI")
        console.error(err);
        result.code = 500;
        result.message = err;
        reject(result);
      })
    });
}


// Sends a DM from the caller to the requested DM document
exports.sendDirectMessage = (req, res) => {
  return res.status(200).json({message: "Not implemented yet"})
}

// Creates a DM between the caller and the user in the request
exports.createDirectMessage = (req, res) => {
  // TODO: Check if the user exists
  // TODO: Check if this user has dms enabled
  // TODO: Check if they have dms enabled
  // TODO: Check if there is already a dm

  // this.checkDirectMessagesEnabled(req, res);
}

// Checks if the requested user has DMs enable or not
/* Request Parameters
 * user: str
 */
exports.checkDirectMessagesEnabled = (req, res) => {
  isDirectMessageEnabled(req.body.user)
    .then(() => {
      return res.status(200).json({enabled: true});
    })
    .catch((result) => {
      console.log(result);
      if (result.code === 0) {
        // DMs are disabled
        return res.status(200).json({enabled: false});
      } else {
        // Some other error occured
        return res.status(result.code).json({err: result.message});
      }
    })
}

exports.getUserHandles = (req, res) => {
  admin
    .firestore()
    .collection("users")
    .get()
    .then(data => {
      let users = [];
      data.forEach(function(doc) {
        users.push(doc.data().handle);
      });
      return res.status(200).json(users);
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: "Failed to get all user handles." });
    });
};
