const admin = require('firebase-admin');
/* eslint-disable promise/always-return */
exports.putPost = (req, res) => {
    if (req.body.body.trim() === '') {
        return res.status(400).json({ body: 'Body must not be empty!'});
    }

    const newPost = {
        body: req.body.body,
        userHandle: req.body.userHandle,
        userImage: req.body.userImage,
        title: req.body.title,
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

