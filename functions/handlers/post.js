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

exports.getFollowedPosts = (req, res) => {
    var post_query = admin.firestore().collection("posts");
    var followers_list = admin.firestore().collection("users").doc(req.user.handle).collection("followedUsers");
    let followers_str = [];
    followers_str.push(req.user.handle);

    followers_list.get()
    .then(function(allFollowers) {
        allFollowers.forEach(function(followers) {
            followers_str.push(followers.data().handle);
        });

        post_query.get()
        .then(function(allPosts) {
            let posts = [];
            allPosts.forEach(function(doc) {
                if(followers_str.includes(doc.data().userHandle)) {
                    posts.push(doc.data());
                }
            });
            return res.status(200).json(posts);
        })
        /*.then(function() {
            res.status(200).send("Successfully retrieved all posts from followed users.");
            return;
        })*/
        .catch(function(err) {
            res.status(500).send("Failed to retrieve posts.", err);
        });
    })
    .then(function() {
        //res.status(200).send("Successfully added all follower handles to array.");
        //res.status(200).send("Successfully retrieved all posts from followed users.");
        return;
    })
    .catch(function(err) {
        res.status(500).send("Failed to retrieve follower handles.", err);
    });
};
