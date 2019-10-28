/* eslint-disable prefer-arrow-callback */
/* eslint-disable promise/always-return */
const admin = require('firebase-admin');
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

exports.getFilteredPosts = (req, res) => {
    admin.firestore().collection('posts').where('userHandle', '==', 'new user').where('microBlogTopics', '==')
};