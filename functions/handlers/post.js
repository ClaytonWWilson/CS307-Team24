/* eslint-disable promise/always-return */
exports.putPost = (req, res) => {
    if (req.body.body.trim() === '') {
        return res.status(400).json({ body: 'Body must not be empty!'});
    }

    const newPost = {
        body: req.body.body,
        userHandle: req.user.handle,
        userImage: req.user.imageUrl,
        createdAt: new Date().toISOString(),
        likeCount: 0,
        commentCount: 0
    };

    db.collection('post').add(newPost)
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

