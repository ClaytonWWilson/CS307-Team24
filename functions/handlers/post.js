/* eslint-disable prefer-arrow-callback */
/* eslint-disable promise/always-return */
const admin = require('firebase-admin');
exports.putPost = (req, res) => {

    const newPost = {
        body: req.body.body,
        userHandle: req.body.userHandle,
        userImage: req.body.userImage,
        userID: req.userData.userID,
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

exports.getallPostsforUser = (req, res) => {
    admin.firestore().collection('posts').where('userHandle', '==', 'new user' ).get()
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

exports.getAllPosts = (req, res) => {
    db.collection('posts')
        .orderBy('createdAt', 'desc')
        .get()
        .then((data) => {
            let posts = [];
            data.forEach((doc) => {
              posts.push({
                body: doc.data().body,
                userHandle: doc.data().userHandle,
                createdAt: doc.data().createdAt,
                commentCount: doc.data().commentCount,
                likeCount: doc.data().likeCount,
                userImage: doc.data().userImage,
                microBlogTitle: doc.data().microBlogTitle,
                microBlogTopics: doc.data().microBlogTopics,
              });
            });
            return res.json(posts);
          })
          .catch((err) => {
            console.error(err);
            res.status(500).json({ error: err.code });
          });
};