/* eslint-disable prefer-arrow-callback */
/* eslint-disable promise/always-return */
const admin = require('firebase-admin');

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
    .then(function() {
    res.status(200).send("Successfully retrieved all user's posts from database.");
    return;
    })
    .catch(function(err) {
    res.status(500).send("Failed to retrieve user's posts from database.", err);
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
    .then(function() {
    res.status(200).send("Successfully retrieved every post from database.");
    return;
    })
    .catch(function(err) {
    res.status(500).send("Failed to retrieve posts from database.", err);
    });
};

exports.getFilteredPosts = (req, res) => {
    admin.firestore().collection('posts').where('userHandle', '==', 'new user').where('microBlogTopics', '==')
};

exports.getFollowedPosts = (req, res) => {
    var followers_list = admin.firestore().collection("users").doc(req.user.handle).collection("followedUsers");
    var post_query = admin.firestore().collection("posts");

    followers_list.get()
    .then(function(allFollowers) {
        var followers_likedTopics = new Map();

        allFollowers.forEach(function(followers) {
            followers_likedTopics.set(followers.data().handle, followers.data().followedTopics);
        });

        post_query.get()
        .then(function(allPosts) {
            let posts = [];
            allPosts.forEach(function(doc) {
                if(doc.data().userHandle === req.user.handle || doc.data().userHandle === "Admin") {
                    posts.push(doc.data());
                }
                else if(followers_likedTopics.has(doc.data().userHandle)) {
                    doc.data().microBlogTopics.forEach(function(topic) {
                        if(followers_likedTopics.get(doc.data().userHandle).includes(topic)) {
                            posts.push(doc.data());
                        }
                    });
                }
            });
            return res.status(200).json(posts);
        })
        .catch(function(err) {
            res.status(500).send("Failed to retrieve any posts.", err);
        });
    })
    .then(function() {
        //res.status(200).send("Successfully retrieved all interesting posts from followed users.");
        return;
    })
    .catch(function(err) {
        res.status(500).send("Failed to retrieve any posts.", err);
    });
};
