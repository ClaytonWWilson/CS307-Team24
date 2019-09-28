exports.getUserDetails = (req, res) => {
    let userData = {};
    db.doc('/users/${req.params.handle}').get().then((doc) => {
            if (doc.exists) {
                userData.user = doc.data();
                return db.collection('post').where('userHandle', '==', req.params.handle)
                    .orderBy('createdAt', 'desc').get();
            } else {
                return res.status(404).json({
                    error: 'User not found'
                });
            }
        })
        .then((data) => {
            userData.posts = [];
            data.forEach((doc) => {
                userData.posts.push({
                    body: doc.data().body,
                    createAt: doc.data().createAt,
                    userHandle: doc.data().userHandle,
                    userImage: doc.data().userImage,
                    likeCount: doc.data().likeCount,
                    commentCount: doc.data().commentCount,
                    postId: doc.id
                });
            });
            return res.json(userData);
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).json({ error: err.code});
        });
};