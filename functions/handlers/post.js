/* eslint-disable prefer-arrow-callback */
/* eslint-disable promise/always-return */
const admin = require("firebase-admin");
const { db } = require("../util/admin");

exports.putPost = (req, res) => {
  const newPost = {
    body: req.body.body,
    userHandle: req.user.handle,
    userImage: req.body.userImage,
    userID: req.user.uid,
    microBlogTitle: req.body.microBlogTitle,
    createdAt: new Date().toISOString(),
    likeCount: 0,
    commentCount: 0,
    microBlogTopics: req.body.microBlogTopics,
    quoteBody: null
  };

  admin
    .firestore()
    .collection("posts")
    .add(newPost)
    .then(doc => {
      doc.update({ postId: doc.id });
      const resPost = newPost;
      resPost.postId = doc.id;
      return res.status(200).json(resPost);
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: "something went wrong" });
    });
};

exports.getallPostsforUser = (req, res) => {
  var post_query = admin
    .firestore()
    .collection("posts")
    .where("userHandle", "==", req.user.handle);

  post_query
    .get()
    .then(function(myPosts) {
      let posts = [];
      myPosts.forEach(function(doc) {
        posts.push(doc.data());
      });
      return res.status(200).json(posts);
    })
    .then(function() {
      return res
        .status(200)
        .json("Successfully retrieved all user's posts from database.");
    })
    .catch(function(err) {
      return res
        .status(500)
        .json("Failed to retrieve user's posts from database.", err);
    });
};

exports.hidePost = (req, res) => {
    /* db
      .collection("posts")
      .doc(${req.params.postId}) */
      const postId = req.body.postId;
      db.doc(`/posts/${postId}`)
      .update({
        hidden: true
      })
      .then(() => {
        return res.status(200).json({message: "ok"});
      })
      .catch((error) => {
        return res.status(500).json(error);
      })
};

exports.getallPosts = (req, res) => {
  let posts = [];
  let users = {};

  // Get all the posts
  var postsPromise = new Promise((resolve, reject) => {
    db.collection("posts").get()
      .then((allPosts) => {
        allPosts.forEach((post) => {
          posts.push(post.data());
        });
        resolve();
      })
      .catch((error) => {
        reject(error);
      })
  });

  // Get all users
  var usersPromise = new Promise((resolve, reject) => {
    db.collection("users").get()
      .then((allUsers) => {
        allUsers.forEach((user) => {
          users[user.data().handle] = user.data();
        })
        resolve();
      })
      .catch((error) => {
        reject(error);
      })
  });

  // Wait for the two promises
  Promise.all([postsPromise, usersPromise])
    .then(() => {
      let newPosts = []
      // Add the image url of the person who made the post to all of the post objects
      posts.forEach((post) => {
        post.profileImage = users[post.userHandle].imageUrl ? users[post.userHandle].imageUrl : null;
        newPosts.push(post);
      });
      return res.status(200).json(newPosts);
    })
    .catch((error) => {
      return res.status(500).json({error});
    })
};

exports.getOtherUsersPosts = (req, res) => {
  var post_query = admin
    .firestore()
    .collection("posts")
    .where("userHandle", "==", req.body.handle);
    
    post_query += admin
    .firestore()
    .collection("posts")
    .where("microBlogTitle", "==", "Alert").where("userHandle", "==", "Admin");

  post_query
    .get()
    .then(function(myPosts) {
      let posts = [];
      myPosts.forEach(function(doc) {
        posts.push(doc.data());
      });
      return res.status(200).json(posts);
    })
    .then(function() {
      return res
        .status(200)
        .json("Successfully retrieved all user's posts from database.");
    })
    .catch(function(err) {
      return res
        .status(500)
        .json("Failed to retrieve user's posts from database.", err);
    });
};

exports.quoteWithPost = (req, res) => {
    let quoteData;
    const quoteDoc = admin.firestore().collection('quote').
    where('userHandle', '==', req.user.handle).
    where('quoteId', '==', req.params.postId).limit(1);

    const postDoc = db.doc(`/posts/${req.params.postId}`);

    postDoc.get()
    .then((doc) => {
        if(doc.exists) {
            quoteData = doc.data();
            return quoteDoc.get();
        }
        else
        {
            return res.status(404).json({error: 'Post not found'});
        }
    })
    .then(data => {
      if (data.empty) {
        return admin
          .firestore()
          .collection("quote")
          .add({
            quoteId: req.params.postId,
            userHandle: req.user.handle,
            quoteBody: req.body.quoteBody
          })
          .then(() => {
            const post = {
              body: quoteData.body,
              userHandle: req.user.handle,
              quoteBody: req.body.quoteBody,
              createdAt: new Date().toISOString(),
              userImage: req.body.userImage,
              likeCount: 0,
              commentCount: 0,
              userID: req.user.uid,
              microBlogTitle: quoteData.microBlogTitle,
              microBlogTopics: quoteData.microBlogTopics,
              quoteId: req.params.postId
            };
            return admin
              .firestore()
              .collection("posts")
              .add(post)
              .then(doc => {
                doc.update({ postId: doc.id });
                const resPost = post;
                resPost.postId = doc.id;
                return res.status(200).json(resPost);
              });
          });
      } else {
        return res.status(400).json({ error: "Post has already been quoted." });
      }
    })

    .catch(err => {
      return res.status(500).json({ error: err });
    });
};

exports.quoteWithoutPost = (req, res) => {
    let quoteData;
    const quoteDoc = admin.firestore().collection('quote').
    where('userHandle', '==', req.user.handle).
    where('quoteId', '==', req.params.postId).limit(1);

    const postDoc = db.doc(`/posts/${req.params.postId}`);

    postDoc.get()
    .then((doc) => {
        if(doc.exists) {
            quoteData = doc.data();
            return quoteDoc.get();
        }
        else
        {
            return res.status(404).json({error: 'Post not found'});
        }
    })
    .then(data => {
      if (data.empty) {
        return admin
          .firestore()
          .collection("quote")
          .add({
            quoteId: req.params.postId,
            userHandle: req.user.handle,
            quoteBody: null
          })
          .then(() => {
            const post = {
              userHandle: req.user.handle,
              body: quoteData.body,
              quoteBody: null,
              createdAt: new Date().toISOString(),
              likeCount: 0,
              commentCount: 0,
              userID: req.user.uid,
              userImage: req.body.userImage,
              microBlogTitle: quoteData.microBlogTitle,
              microBlogTopics: quoteData.microBlogTopics,
              quoteId: req.params.postId
            };
            return admin
              .firestore()
              .collection("posts")
              .add(post)
              .then(doc => {
                doc.update({ postId: doc.id });
                const resPost = post;
                resPost.postId = doc.id;
                return res.status(200).json(resPost);
              });
          });
      } else {
        return res.status(400).json({ error: "Post has already been quoted." });
      }
    })
    .catch(err => {
    //   return res.status(500).json({ error: "Something is wrong" });
      return res.status(500).json({ error: err });
    });
};

exports.checkforLikePost = (req, res) => {
  const likedPostDoc = admin
    .firestore()
    .collection("likes")
    .where("userHandle", "==", req.user.handle)
    .where("postId", "==", req.params.postId)
    .limit(1);
  let result;

  likedPostDoc.get().then(data => {
    if (data.empty) {
      result = false;
      return res.status(200).json(result);
    } else {
      result = true;
      return res.status(200).json(result);
    }
  })
  .catch((err) => {
      console.log(err);
      return res.status(500).json({error: err});
  })
};

exports.likePost = (req, res) => {

    const postId = req.params.postId;
    let likedPostDoc;
    db.doc(`/users/${req.userData.handle}`)
        .get()
        .then((userDoc) => {
            let likes = userDoc.data().likes;
            if (likes === undefined || likes === null) {
                likes = [];
            }

            if (likes.includes(postId)) {
                return res.status(400).json({error: "This user has already liked this post"});
            }

            likes.push(postId);

            return userDoc.ref.update({likes})
        })
        .then(() => {
            return db.doc(`/posts/${postId}`).get()
                
        })
        .then((postDoc) => {
            let postData = postDoc.data();
            postData.likeCount++;
            likedPostDoc = postData;
            return postDoc.ref.update({likeCount : postData.likeCount})
        })
        .then(() => {
            return res.status(201).json(likedPostDoc);
        })
        .catch((err) => {
            console.log(err);
            return res.status(500).json({error: err});
        })

    // let postData;
    // const likeDoc = admin.firestore().collection('likes').where('userHandle', '==', req.user.handle)
    // .where('postId', '==', req.params.postId).limit(1);

    // const postDoc = db.doc(`/posts/${req.params.postId}`);

    // postDoc.get()
    // .then((doc) => {
    //     if(doc.exists) {
    //         postData = doc.data();
    //         return likeDoc.get();
    //     }
    //     else
    //     {
    //         return res.status(404).json({error: 'Post not found'});
    //     }
    // })
    // .then((data) => {
    //     if (data.empty) {
    //         return admin.firestore().collection('likes').add({
    //             postId : req.params.postId,
    //             userHandle: req.user.handle

    //         })
    //         .then(() => {
    //             postData.likeCount++;
    //             return postDoc.update({likeCount : postData.likeCount})
    //         })
    //         .then(() => {
    //             return res.status(200).json(postData);
    //         })
    //     }
    // })
    // .catch((err) => {
    //     return res.status(500).json({error: 'Something is wrong'});
    // })

}


exports.unlikePost = (req, res) => {

    const postId = req.params.postId;
    let likedPostDoc;
    db.doc(`/users/${req.userData.handle}`)
        .get()
        .then((userDoc) => {
            let likes = userDoc.data().likes;
            if (likes === undefined || likes === null) {
                likes = [];
            }

            if (!likes.includes(postId)) {
                return res.status(400).json({error: "This user hasn't liked this post yet"});
            }

            let i;
            for (i = 0; i < likes.length; i++) {
                if (likes[i] === postId) {
                    likes.splice(i, 1);
                }
            }

            return userDoc.ref.update({likes})
        })
        .then(() => {
            return db.doc(`/posts/${postId}`).get()
                
        })
        .then((postDoc) => {
            let postData = postDoc.data();
            postData.likeCount--;
            likedPostDoc = postData;
            return postDoc.ref.update({likeCount : postData.likeCount})
        })
        .then(() => {
            return res.status(201).json(likedPostDoc);
        })
        .catch((err) => {
            console.log(err);
            return res.status(500).json({error: err});
        })

    // let postData;
    // const likeDoc = admin.firestore().collection('likes').where('userHandle', '==', req.user.handle)
    // .where('postId', '==', req.params.postId).limit(1);

    // const postDoc = db.doc(`/posts/${req.params.postId}`);

    // postDoc.get()
    // .then((doc) => {
    //     if(doc.exists) {
    //         postData = doc.data();
    //         return likeDoc.get();
    //     }
    //     else
    //     {
    //         return res.status(404).json({error: 'Post not found'});
    //     }
    // })
    // .then((data) => {
    //         return db
    //           .doc(`/likes/${data.docs[0].id}`)
    //           .delete()
    //           .then(() => {
    //             postData.likeCount--;
    //             return postDoc.update({ likeCount: postData.likeCount });
    //           })
    //           .then(() => {
    //             res.status(200).json(postData);
    //           });
          
    // })
    // .catch((err) => {
    //     console.error(err);
    //     return res.status(500).json({error: 'Something is wrong'});
    // })

}


exports.getLikes = (req, res) => {
    db.doc(`/users/${req.userData.handle}`)
        .get()
        .then((doc) => {
            let likes = doc.data().likes;
            if (likes === undefined || likes === null) {
                likes = [];
            }
            return res.status(200).json({likes});
        })
        .catch((err) => {
            console.log(err);
            return res.status(500).json({error: err});
        })
}

exports.getFilteredPosts = (req, res) => {

  admin
    .firestore()
    .collection("posts")
    .where("userHandle", "==", "new user")
    .where("microBlogTopics", "==");
};

