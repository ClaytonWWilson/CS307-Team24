/* eslint-disable promise/always-return */
const admin = require('firebase-admin');
const { db } = require('../util/admin');

exports.putPost = (req, res) => {

    const newPost = {
        body: req.body.body,
        userHandle: req.userData.handle,
        userImage: req.body.userImage,
        userID: req.userData.userId,
        microBlogTitle: req.body.microBlogTitle,
        createdAt: new Date().toISOString(),
        likeCount: 0,
        commentCount: 0,
        microBlogTopics: req.body.microBlogTopics
        
    };

    admin.firestore().collection('posts').add(newPost)
    .then((doc) => {
        const resPost = newPost;
        resPost.postId = doc.id;
        return res.status(200).json(resPost);
    })
    .catch((err) => {
        console.error(err);
        return res.status(500).json({ error: 'something is wrong'});
    });
};


exports.getPost = (req, res) => {
    let postData = {};
    db.doc(`/posts/${req.params.postId}`)
    .get()
    .then((doc) => {
        if (!doc.exists) {
            return res.status(404).json({error: 'Post is not found'});

        }
        postData = doc.data();
        postData.postId = doc.id;
        return res.status(200).json(postData);
    })
    .catch((err) => {
        console.error(err); 
        return res.status(500).json({error: 'Something is wrong'});
    })
}

exports.likePost = (req, res) => {
    let postData;
    const likeDoc = admin.firestore().collection('likes').where('userHandle', '==', req.userData.handle)
    .where('postId', '==', req.params.postId).limit(1);

    const postDoc = db.doc(`/posts/${req.params.postId}`);

    likeDoc.get()
    .then((data) => {
        if (data.empty) {
            return admin.firestore().collection('likes').add({
                postId : req.params.postId,
                userHandle: req.userData.handle
            })
            .then(() => {
                postData.likeCount++;
                return postDoc.update({likeCount : postData.likeCount})
            })
            .then(() => {
                return res.status(200).json(postData);
            })
        }
        else {
            return res.status(400).json({error: 'Post has already been liked.'})
        }
    })
    .catch((err) => {
        console.error(err);
        return res.status(500).json({error: 'Something is wrong'});
    })

}

exports.unlikePost = (re, res) => {

    let postData;
    const likeDoc = admin.firestore().collection('likes').where('userHandle', '==', req.userData.handle)
    .where('postId', '==', req.params.postId).limit(1);

    const postDoc = db.doc(`/posts/${req.params.postId}`);

    likeDoc.get()
    .then((data) => {
        if (data.empty) {
            return res.status(400).json({ error: 'Post cannot be unliked because it is not liked at the moment.' });
          } else {
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
          }
    })
    .catch((err) => {
        console.error(err);
        return res.status(500).json({error: 'Something is wrong'});
    })

}

exports.getallPostsforFeed = (req, res) => {
    admin.firestore().collection('posts').get()
    .then((data) => {
        let posts = [];
        
        data.forEach(function(doc) {
            posts.push( {
                microBlogs: doc.data(),
                id: doc.id,
            })
                 
        });
        return res.status(200).json(posts);
    })
    .catch((err) => {
        console.error(err);
        return res.status(500).json({error: 'Failed to fetch all posts written by all other users.'})
    })
};

exports.getallPostsforUser = (req, res) => {
    admin.firestore().collection('posts').where('userHandle', '==', req.userData.handle ).get()
    .then((data) => {
        let posts = [];
        data.forEach(function(doc) {
            posts.push(doc.data());
        });
        return res.status(200).json(posts);
    })
    .catch((err) => {
        console.error(err);
        return res.status(500).json({error: 'Failed to fetch all posts written by specific user.'})
    })
};
