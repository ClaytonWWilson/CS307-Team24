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
            return res.status(200).json(resPost);
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).json({ error: 'something is wrong'});
        });
};

