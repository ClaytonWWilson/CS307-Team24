const admin = require('firebase-admin');
/* eslint-disable promise/always-return */
exports.putPost = (req, res) => {
    

    const newPost = {
        body: req.body.body,
        userHandle: req.body.userHandle,
        userImage: req.body.userImage,
        microBlogTitle: req.body.microBlogTitle,
        createdAt: new Date().toISOString(),
        likeCount: 0,
        commentCount: 0,
        
    };

    admin.firestore().collection('posts').add(newPost)
            .then((doc) => {
            const resPost = newPost;
            resPost.postId = doc.id;
            res.json(resPost);

        })
        .catch((err) => {
            res.status(500).json({ error: 'something is wrong'});
            console.error(err);
        });
};

