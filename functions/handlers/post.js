/* eslint-disable prefer-arrow-callback */
/* eslint-disable promise/always-return */
const admin = require('firebase-admin');
const { db } = require('../util/admin');


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
        microBlogTopics: req.body.microBlogTopics
    };

    admin.firestore().collection('posts').add(newPost)
    .then((doc) => {
        doc.update({postId: doc.id})
        const resPost = newPost;
        resPost.postId = doc.id;
        return res.status(200).json(resPost);
    })
    .catch((err) => {
        console.error(err);
        return res.status(500).json({ error: 'something went wrong'});
    });
};

exports.getallPostsforUser = (req, res) => {
    var post_query = admin.firestore().collection("posts").where("userHandle", "==", req.user.handle);
    post_query.get()
    .then(function(myPosts) {
        let posts = [];
        myPosts.forEach(function(doc) {
            posts.push(doc.data());
        });
        return res.status(200).json(posts);
    })
    // .then(function() {
    //     return res.status(200).json("Successfully retrieved all user's posts from database.");
    // })
    .catch(function(err) {
        return res.status(500).json(`Failed to retrieve user's posts from database.\n${err}`);
    });
};

exports.getallPosts = (req, res) => {
    var post_query = admin.firestore().collection("posts");
    post_query.get()
        .then(function(allPosts) {
            let posts = [];
            allPosts.forEach(function(doc) {
                posts.push(doc.data());
            });
            return res.status(200).json(posts);
        })
        // .then(function() {
        //     return res.status(200).json("Successfully retrieved every post from database.");
        // })
        .catch(function(err) {
            return res.status(500).json(`Failed to retrieve posts from database.\n ${err}`);
        });
};

exports.quoteWithPost = (req, res) => {

    let quoteData;
    const quoteDoc = admin.firestore().collection('quote').
    where('userHandle', '==', req.user.handle).
    where('postId', '==', req.params.postId).limit(1);

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
    .then((data) => {
        if(data.empty) {
            return admin.firestore().collection('quote').add({
                postId : req.params.postId,
                userHandle : req.user.handle,
                quotePost : req.body.quotePost
            })
            .then(() => {
               return admin.firestore().collection('posts').add({
                   quoteData,
                   quoteUser : req.user.handle,
                   quotePost : req.body.quotePost,
                   quotedAt : new Date().toISOString()

               })
            })
        }
        else {
            return res.status(400).json({ error: 'Post has already been quoted.' });
          }
    })
    .catch((err) => {
        return res.status(500).json({error: err});

    })

}

exports.quoteWithoutPost = (req, res) => {
    let quoteData;
    const quoteDoc = admin.firestore().collection('quote').
    where('userHandle', '==', req.user.handle).
    where('postId', '==', req.params.postId).limit(1);

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
    .then((data) => {
        if(data.empty) {
            return admin.firestore().collection('quote').add({
                postId : req.params.postId,
                userHandle : req.user.handle,
            })
            .then(() => {
               return admin.firestore().collection('posts').add({
                   quoteData,
                   quoteUser : req.user.handle,
                   quotedAt : new Date().toISOString()

               })
            })
        }
        else {
        return res.status(400).json({ error: 'Post has already been quoted.' });
      }
    })
    .catch((err) => {
        return res.status(500).json({error: 'Something is wrong'});

    })

}


exports.likePost = (req, res) => {
    let postData;
    const likeDoc = admin.firestore().collection('likes').where('userHandle', '==', req.user.handle)
    .where('postId', '==', req.params.postId).limit(1);

    const postDoc = db.doc(`/posts/${req.params.postId}`);

    postDoc.get()
    .then((doc) => {
        if(doc.exists) {
            postData = doc.data();
            return likeDoc.get();
        }
        else
        {
            return res.status(404).json({error: 'Post not found'});
        }
    })
    .then((data) => {
        if (data.empty) {
            return admin.firestore().collection('likes').add({
                postId : req.params.postId,
                userHandle: req.user.handle

            })
            .then(() => {
                postData.likeCount++;
                return postDoc.update({likeCount : postData.likeCount})
            })
            .then(() => {
                return res.status(200).json(postData);
            })
        }
    })
    .catch((err) => {
        return res.status(500).json({error: 'Something is wrong'});
    })

}

exports.unlikePost = (req, res) => {

    let postData;
    const likeDoc = admin.firestore().collection('likes').where('userHandle', '==', req.user.handle)
    .where('postId', '==', req.params.postId).limit(1);

    const postDoc = db.doc(`/posts/${req.params.postId}`);

    postDoc.get()
    .then((doc) => {
        if(doc.exists) {
            postData = doc.data();
            return likeDoc.get();
        }
        else
        {
            return res.status(404).json({error: 'Post not found'});
        }
    })
    .then((data) => {
            return db
              .doc(`/likes/${data.docs[0].id}`)
              .delete()
              .then(() => {
                postData.likeCount--;
                return postDoc.update({ likeCount: postData.likeCount });
              })
              .then(() => {
                res.status(200).json(postData);
              });
          
    })
    .catch((err) => {
        console.error(err);
        return res.status(500).json({error: 'Something is wrong'});
    })

}

exports.getFilteredPosts = (req, res) => {
    admin.firestore().collection('posts').where('userHandle', '==', 'new user').where('microBlogTopics', '==')
};
