/* eslint-disable promise/catch-or-return */
/* eslint-disable promise/always-return */

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
        // FIX: doc variable is out of scope
        // if (!doc.exists) {
        //   return res
        //     .status(403)
        //     .json({ general: "Invalid credentials. Please try again." });
        // }
        console.log(err);
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
  req.userData.imageUrl
    ? (imageFileName = req.userData.imageUrl.split("/o/")[1].split("?alt=")[0])
    : (imageFileName = "no-img.png");

  const userId = req.userData.userId;
  let errors = {};

  function thenFunction(data) {
    console.log(`${data} for ${req.userData.handle} has been deleted.`);
  }

  function catchFunction(data, err) {
    console.error(err);
    errors[data] = err;
  }

  function deleteDirectMessages() {
    return new Promise((resolve, reject) => {
      const deleteUsername = req.userData.handle;
      db.doc(`/users/${deleteUsername}`)
        .get()
        .then(deleteUserDocSnap => {
          const dms = deleteUserDocSnap.data().dms;
          const dmRecipients = deleteUserDocSnap.data().dmRecipients;

          if (!dms) {
            resolve();
            return;
          }

          // Iterate over the list of users who this person has DM'd
          let otherUsersPromises = [];

          // Resolve if they don't have a dmRecipients list
          if (
            dmRecipients === undefined ||
            dmRecipients === null ||
            dmRecipients.length === 0
          ) {
            resolve();
            return;
          }
          dmRecipients.forEach(dmRecipient => {
            otherUsersPromises.push(
              // Get each users data
              db
                .doc(`/users/${dmRecipient}`)
                .get()
                .then(otherUserDocSnap => {
                  // Get the index of deleteUsername so that we can remove the dangling
                  // reference to the DM document
                  let otherUserDMRecipients = otherUserDocSnap.data()
                    .dmRecipients;
                  let otherUserDMs = otherUserDocSnap.data().dms;
                  let index = -1;
                  otherUserDMRecipients.forEach((dmRecip, i) => {
                    if (dmRecip === deleteUsername) {
                      index = i;
                    }
                  });

                  if (index !== -1) {
                    // Remove deleteUsername from their dmRecipients list
                    otherUserDMRecipients.splice(index, 1);

                    // Remove the DM channel with deleteUsername
                    otherUserDMs.splice(index, 1);

                    // Update the users data
                    return otherUserDocSnap.ref.update({
                      dmRecipients: otherUserDMRecipients,
                      dms: otherUserDMs
                    });
                  }
                })
            );
          });

          // Wait for the removal of DM data stored on other users to be deleted
          Promise.all(otherUsersPromises)
            .then(() => {
              // Iterate through DM references and delete them from the dm collection
              let dmRefsPromises = [];
              dms.forEach(dmRef => {
                // Create a delete queue
                let batch = db.batch();
                dmRefsPromises.push(
                  // Add the messages to the delete queue
                  db
                    .collection(`/dm/${dmRef.id}/messages`)
                    .listDocuments()
                    .then(docs => {
                      console.log("second");
                      console.log(docs);
                      docs.map(doc => {
                        batch.delete(doc);
                      });

                      // Add the doc that the DM is stored in to the delete queue
                      batch.delete(dmRef);

                      // Commit the writes
                      return batch.commit();
                    })
                );
              });

              return Promise.all(dmRefsPromises);
            })
            .then(() => {
              resolve();
              return;
            })
            .catch(err => {
              console.log("error " + err);
              reject(err);
              return;
            });
        })
        .catch(err => {
          console.log(err);
          return res.status(500).json({ error: err });
        });
    });
  }

  // Deletes user from authentication
  let auth = admin.auth().deleteUser(userId);

  // Deletes database data
  let data = new Promise((resolve, reject) => {
    deleteDirectMessages()
      .then(() => {
        return db
          .collection("users")
          .doc(`${req.user.handle}`)
          .delete();
      })
      .then(() => {
        resolve();
        return;
      })
      .catch(err => {
        console.log(err);
        reject(err);
        return;
      });
  });

  // Deletes any custom profile image
  let image;
  if (imageFileName !== "no-img.png") {
    image = admin
      .storage()
      .bucket()
      .file(imageFileName)
      .delete();
  } else {
    image = Promise.resolve();
  }

  // Deletes all users posts
  let posts = db
    .collection("posts")
    .where("userHandle", "==", req.user.handle)
    .get()
    .then(query => {
      query.forEach(snap => {
        snap.ref.delete();
      });
      return;
    });

  let promises = [
    auth.then(thenFunction("auth")).catch(err => catchFunction("auth", err)),
    data.then(thenFunction("data")).catch(err => catchFunction("data", err)),
    image.then(thenFunction("image")).catch(err => catchFunction("image", err)),
    posts.then(thenFunction("posts")).catch(err => catchFunction("image", err))
  ];

  // Wait for all promises to resolve
  let waitPromise = Promise.all(promises);

  waitPromise
    .then(() => {
      if (Object.keys(errors) > 0) {
        return res.status(500).json(errors);
      } else {
        return res.status(200).json({
          message: `All data for ${req.userData.handle} has been deleted.`
        });
      }
    })
    .catch(err => {
      return res.status(500).json({ error: err });
    });
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
    .set(profileData)
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

exports.getAllHandles = (req, res) => {
  var user_query = admin.firestore().collection("users");
  user_query
    .get()
    .then(allUsers => {
      let users = [];
      allUsers.forEach(user => {
        users.push(user.data().handle);
      });
      return res.status(200).json(users);
    })
    .catch(err => {
      return res.status(500).json({
        message: "Failed to retrieve posts from database.",
        error: err
      });
    });
};

// Returns all data stored for a user
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
    return res.status(403).json({ error: "This must be done as Admin" });
  }

  db.doc(`/users/${req.body.user}`)
    .get()
    .then(doc => {
      if (doc.exists) {
        let verifiedUser = doc.data();
        verifiedUser.verified = true;
        return db
          .doc(`/users/${req.body.user}`)
          .set(verifiedUser, { merge: true });
      } else {
        return res
          .status(400)
          .json({ error: `User ${req.body.user} was not found` });
      }
    })
    .then(() => {
      return res
        .status(201)
        .json({ message: `${req.body.user} is now verified` });
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};

// Unverifies the user sent to the request
// Must be run by admin
exports.unverifyUser = (req, res) => {
  if (req.userData.handle !== "Admin") {
    return res.status(403).json({ error: "This must be done as Admin" });
  }

  db.doc(`/users/${req.body.user}`)
    .get()
    .then(doc => {
      if (doc.exists) {
        let unverifiedUser = doc.data();
        unverifiedUser.verified = false;
        return db
          .doc(`/users/${req.body.user}`)
          .set(unverifiedUser, { merge: true });
      } else {
        return res
          .status(400)
          .json({ error: `User ${req.body.user} was not found` });
      }
    })
    .then(() => {
      return res
        .status(201)
        .json({ message: `${req.body.user} is no longer verified` });
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};

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
 *     hasDirectMessagesEnabled: bool
 *     recentMessage: str
 *     recentMessageTimestamp: ISOString
 *   }
 */

  // Returns all the messages in a dm documentSnapshot
  function getMessages(dm) {
    let promise = new Promise((resolve, reject) => {
      let messagesCollection = dm.collection("messages");

      // If the messagesCollection is missing, that means that there aren't any messages
      if (messagesCollection === null || messagesCollection === undefined) {
        return;
      }

      let msgs = [];
      let promises = [];

      // Get all of the messages in the DM
      messagesCollection.get().then(dmQuerySnap => {
        dmQuerySnap.forEach(dmQueryDocSnap => {
          promises.push(
            dmQueryDocSnap.ref.get().then(messageData => {
              msgs.push(messageData.data());
              return;
            })
          );
        });

        let waitPromise = Promise.all(promises);
        waitPromise.then(() => {
          // Sort the messages in reverse order by date
          // Newest should be at the bottom, because that's how they will be displayed on the front-end
          msgs.sort((a, b) => {
            return b.createdAt > a.createdAt
              ? -1
              : b.createdAt < a.createdAt
              ? 1
              : 0;
          });
          resolve(msgs);
        });
      });
    });
    return promise;
  }

  const dms = req.userData.dms;
  const dmRecipients = req.userData.dmRecipients;

  // Return null if this user has no DMs
  if (dms === undefined || dms === null || dms.length === 0)
    return res.status(200).json({ data: null });

  let dmsData = [];
  let dmPromises = [];

  dms.forEach(dm => {
    let dmData = {};
    // Make a new promise for each DM document
    dmPromises.push(
      new Promise((resolve, reject) => {
        dm.get() // DM document reference
          .then(doc => {
            let docData = doc.data();

            // Recipient is the person you are messaging
            docData.authors[0] === req.userData.handle
              ? (dmData.recipient = docData.authors[1])
              : (dmData.recipient = docData.authors[0]);

            // Save the createdAt time
            dmData.createdAt = docData.createdAt;

            // Get all the messages from this dm document
            getMessages(dm).then(msgs => {
              dmData.messages = msgs;
              dmData.recentMessage =
                msgs.length !== 0 ? msgs[msgs.length - 1].message : null;
              dmData.recentMessageTimestamp =
                msgs.length !== 0 ? msgs[msgs.length - 1].createdAt : null;
              dmData.dmId = doc.id;
              resolve(dmData);
            });
          })
          .catch(err => {
            console.err(err);
            return res.status(400).json({
              error: {
                message:
                  "An error occurred when reading the DM document reference",
                error: err
              }
            });
          });
      }).then(dmData => {
        dmsData.push(dmData);
      })
    );
  });

  // Get all the data from the users to get the data on whether they have DMs enabled or not
  let userPromises = [];
  dmRecipients.forEach((recipient) => {
    userPromises.push(
      db.doc(`/users/${recipient}`)
        .get()
    )
  })


  // Wait for all DM document promises to resolve before returning data
  Promise.all(dmPromises)
    .then(() => {
      return Promise.all(userPromises)
    })
    .then((userData) => {
      // Sort the DMs so that the ones with the newest messages are at the top
      dmsData.sort((a, b) => {
        if (
          a.recentMessageTimestamp === null &&
          b.recentMessageTimestamp === null
        ) {
          if (b.createdAt < a.createdAt) {
            return -1;
          } else if (b.createdAt > a.createdAt) {
            return 1;
          } else {
            return 0;
          }
        } else if (a.recentMessageTimestamp === null) {
          return 1;
        } else if (b.recentMessageTimestamp === null) {
          return -1;
        } else if (b.recentMessageTimestamp < a.recentMessageTimestamp) {
          return -1;
        } else if (b.recentMessageTimestamp > a.recentMessageTimestamp) {
          return 1;
        } else {
          return 0;
        }
      });
    
      dmsData.forEach((dm) => {
        dm.hasDirectMessagesEnabled = userData.find((user) => {
            if (dm.recipient === user.data().handle) {
              return true
            } else {
              return false
            }}).data().dmEnabled === false ? false : true
      })
      return res.status(200).json({data: dmsData})
    })
    .catch(err => {
      return res.status(500).json({
        error: {
          message: "An error occurred while sorting",
          error: err
        }
      });
    });
};

// Toggles direct messages on or off depending on the requese
/* Request Parameters
 * enable: bool
 */
exports.toggleDirectMessages = (req, res) => {
  const enable = req.body.enable;
  const user = req.userData.handle;
  db.doc(`/users/${user}`)
    .update({ dmEnabled: enable })
    .then(() => {
      return res.status(201).json({ message: "Success" });
    })
    .catch(err => {
      return res.status(500).json({ error: err });
    });
};

// Returns a promise that resolves if user has DMs enabled
// and rejects if there is an error or DMs are disabled
isDirectMessageEnabled = username => {
  return new Promise((resolve, reject) => {
    let result = {};
    result.code = null;
    result.message = null;
    if (username === null || username === undefined || username === "") {
      result.code = 400;
      result.message =
        "No user was sent in the request. The request should have a non-empty 'user' key.";
      reject(result);
    }

    db.doc(`/users/${username}`)
      .get()
      .then(doc => {
        if (doc.exists) {
          // console.log(doc.data())
          if (
            doc.data().dmEnabled === true ||
            doc.data().dmEnabled === null ||
            doc.data().dmEnabled === undefined
          ) {
            // Assume DMs are enabled if they don't have a dmEnabled key
            resolve(result);
          } else {
            result.code = 400;
            result.message = `${username} has DMs disabled`;
            reject(result);
          }
        } else {
          console.log(`${username} is not in the database`);
          result.code = 400;
          result.message = `${username} is not in the database`;
          reject(result);
        }
      })
      .catch(err => {
        console.log("HI");
        console.error(err);
        result.code = 500;
        result.message = err;
        reject(result);
      });
  });
};

// Returns a promise that resolves if the data in the DM is valid and
// rejects if there are any error. Errors are returned in the promise
verifyDirectMessageIntegrity = dmRef => {
  return new Promise((resolve, reject) => {
    resolve("Not implemented yet");
  });
};

// Checks if there are any DM channels open with userB on userA's side
oneWayCheck = (userA, userB) => {
  return new Promise((resolve, reject) => {
    db.doc(`/users/${userA}`)
      .get()
      .then(userASnapshot => {
        const dmList = userASnapshot.data().dms;
        const dmRecipients = userASnapshot.data().dmRecipients;

        if (
          dmList === null ||
          dmList === undefined ||
          dmRecipients === null ||
          dmRecipients === undefined
        ) {
          // They don't have any DMs yet
          console.log("No DMs array");
          userASnapshot.ref
            .set({ dms: [], dmRecipients: [] }, { merge: true })
            .then(() => {
              resolve();
            });
        } else if (dmList.length === 0) {
          // Their DMs are empty
          console.log("DMs array is empty");
          resolve();
        } else {
          // let dmDocs = [];
          // let forEachPromises = [];
          // dmList.forEach((dmRef) => {
          //   forEachPromises.push(
          //     dmRef.get()
          //       // .then((dmDoc) => {
          //         // TODO: Figure out why dmDoc.exists() isn't working
          //         // Make sure all of the docs exist and none of the references
          //         // are broken
          //         // if (dmDoc.exists()) {
          //           // dmDocs.push(dmDoc);
          //         // } else {
          //         //   console.log(`DM reference /dm/${dmDoc.id} is invalid`);
          //         //   reject(`DM reference /dm/${dmDoc.id} is invalid`);
          //         // }
          //       // })
          //   )
          // })

          dmRecipients.forEach(dmRecipient => {
            if (dmRecipient === userB) {
              console.log(`You already have a DM with ${userB}`);
              // reject(new Error(`You already have a DM with ${userB}`));
              reject({code: 400, message: `You already have a DM with that user`});
              return;
            }
          });

          resolve();

          // Promise.all(forEachPromises)
          //   .then((dmDocs) => {
          //     // Check if any of the DMs have for userA have userA and userB as the authors.
          //     // This would mean that they already have a DM channel
          //     dmDocs.forEach((dmDoc) => {
          //       // Checking if any of the authors key in any of their DMs are missing
          //       let authors = dmDoc.data().authors;

          //       // if (authors[0] === "keanureeves") {
          //       //   console.log("it is")
          //       //   resolve();
          //       // } else {
          //       //   console.log("it is not")
          //       //   reject("not my keanu");
          //       // }
          //       // if (authors === null || authors === undefined || authors.length !== 2) {
          //       //   // console.log(`The authors key in /dm/${dmDoc.id} is undefined or missing values`);
          //       //   // reject(`The authors key in /dm/${dmDoc.id} is undefined or missing values`);
          //       //   console.log('a')
          //       //   reject("a")
          //       // } else if ((authors[0] === userA && authors[1] === userB) || (authors[1] === userA && authors[0] === userB)) {
          //       //   // console.log(`${userA} already has a DM channel between ${userA} and ${userB}`);
          //       //   // reject(`${userA} already has a DM channel between ${userA} and ${userB}`);
          //       //   console.log('b')
          //       //   reject('b')
          //       // } else {
          //       //   // BUG: For some reason the promise.all is resolving even though there are multiple rejects
          //       //   // and only one resolve
          //       //   console.log("c");
          //       //   resolve();
          //       // }
          //       // console.log(authors)
          //       // console.log([userA, userB])
          //       if (authors[0] === null || authors === undefined || authors.length !== 2) {
          //         console.log('a');
          //         reject('a');
          //       } else if (authors[0] === userA && authors[1] === userB) {
          //         console.log("b");
          //         reject('b');
          //       } else {
          //         console.log('c');
          //         resolve();
          //       }
          //     })
          //   })
        }
      });
  });
};

// Returns a promise that resolves if there is not already a DM channel
// between the creator and recipient usernames. It rejects if one already
// exists or there is an error.
checkNoDirectMessageExists = (creator, recipient) => {
  return new Promise((resolve, reject) => {
    let creatorPromise = oneWayCheck(creator, recipient);
    let recipientPromise = oneWayCheck(recipient, creator);
    let temp_array = [];
    temp_array.push(creatorPromise);
    temp_array.push(recipientPromise);

    Promise.all(temp_array)
      .then(() => {
        resolve();
      })
      .catch(err => {
        reject(err);
      });
  });
};

addDirectMessageToUser = (username, recipient, dmRef) => {
  return new Promise((resolve, reject) => {
    db.doc(`/users/${username}`)
      .get()
      .then(docSnap => {
        let dmList = docSnap.data().dms;
        let dmRecipients = docSnap.data().dmRecipients;
        dmList.push(dmRef);
        dmRecipients.push(recipient);
        return db
          .doc(`/users/${username}`)
          .update({ dms: dmList, dmRecipients });
      })
      .then(() => {
        resolve();
      })
      .catch(err => {
        reject(err);
      });
  });
};

// Sends a DM from the caller to the requested DM document
/* Request Parameters
 * message: str
 * user: str
 */
exports.sendDirectMessage = (req, res) => {
  // TODO: add error checking for if message or user is null
  const creator = req.userData.handle;
  const recipient = req.body.user;
  const message = req.body.message;

  const newMessage = {
    author: creator,
    createdAt: new Date().toISOString(),
    message,
    messageId: null
  };

  db.doc(`/users/${recipient}`)
    .get()
    .then((recipDoc) => {
      // Return if the other user has DM's disabled
      if (recipDoc.data().dmEnabled === false && recipDoc.data().dmEnabled !== null && recipDoc.data().dmEnabled !== undefined) {
        return res.status(400).json({error: "This user has DMs disabled"});
      }
    })

  db.doc(`/users/${creator}`).get()
    .then((userDoc) => {
      let dmList = userDoc.data().dms;

      // Return if the creator doesn't have any DMs.
      // This means they have not created a DM's channel yet
      if (dmList === null || dmList === undefined) {
        return res.status(400).json({error: `There is no DM channel between ${creator} and ${recipient}. Use /api/dms/new.`})
      }
      
      let dmRefPromises = [];
      dmList.forEach(dmRef => {
        dmRefPromises.push(
          new Promise((resolve, reject) => {
            dmRef
              .get()
              .then(dmDoc => {
                let authors = dmDoc.data().authors;
                if (
                  (authors[0] === creator && authors[1] === recipient) ||
                  (authors[1] === creator && authors[0] === recipient)
                ) {
                  resolve({ correct: true, dmRef });
                } else {
                  resolve({ correct: false, dmRef });
                }
              })
              .catch(err => {
                reject(err);
              });
          })
        );
      });

      return Promise.all(dmRefPromises);
    })
    .then(results => {
      let correctDMRef = null;
      results.forEach(result => {
        if (result.correct) {
          correctDMRef = result.dmRef;
        }
      });

      if (correctDMRef === null) {
        console.log(
          `There is no DM channel between ${creator} and ${recipient}. Use /api/dms/new.`
        );
        return res.status(400).json({
          error: `There is no DM channel between ${creator} and ${recipient}. Use /api/dms/new.`
        });
      }

      return db.collection(`/dm/${correctDMRef.id}/messages`).add(newMessage);
    })
    .then(newMsgRef => {
      return newMsgRef.update({ messageId: newMsgRef.id }, { merge: true });
    })
    .then(() => {
      return res.status(200).json({ message: "OK" });
    })
    .catch(err => {
      console.log(err);
      return res.status(500).json({ error: err });
    });
};

// Creates a DM between the caller and the user in the request
/* Request Parameters
 * user: str
 */
exports.createDirectMessage = (req, res) => {
  const creator = req.userData.handle;
  const recipient = req.body.user;

  // Check if they are DMing themselves
  if (creator === recipient)
    return res.status(400).json({ error: "You can't DM yourself" });

  // Check if this user has DMs enabled
  let creatorEnabled = isDirectMessageEnabled(creator);

  // Check if the requested user has DMs enabled
  let recipientEnabled = isDirectMessageEnabled(recipient);

  // Make sure that they don't already have a DM channel
  let noDMExists = checkNoDirectMessageExists(creator, recipient);

  let dataValidations = [creatorEnabled, recipientEnabled, noDMExists];

  Promise.all(dataValidations)
    .then(() => {
      // Create a new DM document
      return db.collection("dm").add({});
    })
    .then(dmDocRef => {
      // Fill it with some data.
      // Note that there isn't a messages collection by default.
      let dmData = {
        dmId: dmDocRef.id,
        authors: [creator, recipient],
        createdAt: new Date().toISOString()
      };

      // Update DM document
      let dmDocPromise = dmDocRef.set(dmData);

      // Add the DM reference to the creator
      let updateCreatorPromise = addDirectMessageToUser(
        creator,
        recipient,
        dmDocRef
      );

      // Add the DM reference to the recipient
      let updateRecipientPromise = addDirectMessageToUser(
        recipient,
        creator,
        dmDocRef
      );

      // Wait for all promises
      return Promise.all([
        dmDocPromise,
        updateCreatorPromise,
        updateRecipientPromise
      ]);
    })
    .then(() => {
      return res.status(201).json({ message: "Success!" });
    })
    .catch(err => {
      console.log(err);

      if (err.code && err.message && err.code > 0) {
        // Specific error that I've created
        return res.status(err.code).json({ error: err.message });
      } else {
        // Generic or firebase error
        return res.status(500).json({ error: err });
      }
    });
};

// Checks if the requested user has DMs enable or not
/* Request Parameters
 * user: str
 */
exports.checkDirectMessagesEnabled = (req, res) => {
  isDirectMessageEnabled(req.body.user)
    .then(() => {
      return res.status(200).json({ enabled: true });
    })
    .catch(result => {
      console.log(result);
      if (result.code === 200) {
        // DMs are disabled
        return res.status(200).json({ enabled: false });
      } else {
        // Some other error occured
        return res.status(result.code).json({ err: result.message });
      }
    });
};

exports.getUserHandles = (req, res) => {
  db.doc(`/users/${req.body.userHandle}`)
    .get()
    .then(doc => {
      if (doc.exists) {
        let userHandle = doc.data().handle;
        return res.status(200).json(userHandle);
      } else {
        return res.status(404).json({ error: "user not found" });
      }
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: "Failed to get all user handles." });
    });
};

exports.addSubscription = (req, res) => {
  let new_following = [];
  let userRef = db.doc(`/users/${req.userData.handle}`);
  userRef.get().then(doc => {
    new_following = doc.data().following;
    new_following
      ? new_following.push(req.body.following)
      : (new_following = req.body.following);

    // add stuff
    userRef
      .set({ following: new_following }, { merge: true })
      .then(doc => {
        return res
          .status(201)
          .json({ message: `Following ${req.body.following}` });
      })
      .catch(err => {
        return res.status(500).json({ err });
      });
    // return res.status(200).json({ message: "ok" });
  });
};

exports.getSubs = (req, res) => {
  let data = [];
  db.doc(`/users/${req.userData.handle}`)
    .get()
    .then(doc => {
      data = doc.data().following;
      return res.status(200).json({ data });
    })
    .catch(err => {
      return res.status(500).json({ err });
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
  let oldImageFileName = req.userData.imageUrl
    ? req.userData.imageUrl.split("/o/")[1].split("?alt")[0]
    : null;
  // console.log(`old file: ${oldImageFileName}`);

  busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
    if (mimetype !== "image/jpeg" && mimetype !== "image/png") {
      return res.status(400).json({ error: "Wrong filetype submitted" });
    }
    // console.log(fieldname);
    // console.log(filename);
    // console.log(mimetype);
    const imageExtension = filename.split(".")[filename.split(".").length - 1]; // Get the image file extension
    imageFileName = `${Math.round(
      Math.random() * 100000000000
    )}.${imageExtension}`; // Get a random filename
    const filepath = path.join(os.tmpdir(), imageFileName);
    imageToBeUploaded = { filepath, mimetype };
    file.pipe(fs.createWriteStream(filepath));
  });
  busboy.on("finish", () => {
    // Save the file to the storage bucket
    admin
      .storage()
      .bucket(config.storageBucket)
      .upload(imageToBeUploaded.filepath, {
        resumable: false,
        metadata: {
          metadata: {
            contentType: imageToBeUploaded.mimetype
          }
        }
      })
      .then(() => {
        // Add the new URL to the user's profile
        const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageFileName}?alt=media`;
        return db.doc(`/users/${req.user.handle}`).update({ imageUrl });
      })
      .then(() => {
        // Delete their old image if they have one
        if (oldImageFileName !== null && oldImageFileName !== "no-img.png") {
          admin
            .storage()
            .bucket(config.storageBucket)
            .file(oldImageFileName)
            .delete()
            .then(() => {
              return res
                .status(201)
                .json({ message: "Image uploaded successfully1" });
            })
            .catch(err => {
              console.log(err);
              return res
                .status(201)
                .json({ message: "Image uploaded successfully2" });
            });
          // return res.status(201).json({ message: "Image uploaded successfully"});
        } else {
          return res
            .status(201)
            .json({ message: "Image uploaded successfully3" });
        }
      })
      .catch(err => {
        console.error(err);
        return res.status(500).json({ error: err.code });
      });
  });
  busboy.end(req.rawBody);

  // const BusBoy = require('busboy');
  // const path = require('path');
  // const os = require('os');
  // const fs = require('fs');

  // const busboy = new BusBoy({ headers: req.headers });

  // let imageToBeUploaded = {};
  // let imageFileName;

  // busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
  //   // console.log(fieldname, file, filename, encoding, mimetype);
  //   if (mimetype !== 'image/jpeg' && mimetype !== 'image/png') {
  //     return res.status(400).json({ error: 'Wrong file type submitted' });
  //   }
  //   // my.image.png => ['my', 'image', 'png']
  //   const imageExtension = filename.split('.')[filename.split('.').length - 1];
  //   // 32756238461724837.png
  //   imageFileName = `${Math.round(
  //     Math.random() * 1000000000000
  //   ).toString()}.${imageExtension}`;
  //   const filepath = path.join(os.tmpdir(), imageFileName);
  //   imageToBeUploaded = { filepath, mimetype };
  //   file.pipe(fs.createWriteStream(filepath));
  // });
  // busboy.on('finish', () => {
  //   admin
  //     .storage()
  //     .bucket(config.storageBucket)
  //     .upload(imageToBeUploaded.filepath, {
  //       resumable: false,
  //       metadata: {
  //         metadata: {
  //           contentType: imageToBeUploaded.mimetype
  //         }
  //       }
  //     })
  //     .then(() => {
  //       const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${
  //         config.storageBucket
  //       }/o/${imageFileName}?alt=media`;
  //       return db.doc(`/users/${req.user.handle}`).update({ imageUrl });
  //     })
  //     .then(() => {
  //       return res.json({ message: 'image uploaded successfully' });
  //     })
  //     .catch((err) => {
  //       console.error(err);
  //       return res.status(500).json({ error: 'something went wrong' });
  //     });
  // });
  //   busboy.end(req.rawBody);
};

exports.removeSub = (req, res) => {
  let new_following = [];
  let userRef = db.doc(`/users/${req.userData.handle}`);
  userRef.get().then(doc => {
    new_following = doc.data().following;
    // remove username from array
    new_following.forEach(function(follower, index) {
      if (follower === `${req.body.unfollow}`) {
        new_following.splice(index, 1);
      }
    });

    // update database
    userRef
      .set({ following: new_following }, { merge: true })
      .then(doc => {
        return res
          .status(202)
          .json({ message: `Successfully unfollow ${req.body.unfollow}` });
      })
      .catch(err => {
        return res.status(500).json({ err });
      });

    return res.status(200).json({ message: "ok" });
  });
};
