const {db} = require('../util/admin');
const {validateUpdateProfileInfo} = require('../util/validator');

exports.getProfileInfo = (req, res) => {
    // FIXME: Delete this after login is implemented
    req.user = {};
    req.user.handle = 'itsjimmy';

    db.collection('users').doc(req.user.handle).get()
        .then((data) => {
            return res.status(200).json(data.data());
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).json(err);
        });
};

exports.updateProfileInfo = (req, res) => {
    // FIXME: Delete this after login is implemented
    req.user = {};
    req.user.handle = 'itsjimmy';

    // TODO: Add functionality for adding/updating profile images

    
    // Data validation
    const {valid, errors, profileData} = validateUpdateProfileInfo(req.body);
    if (!valid) return res.status(400).json(errors);
    

    // Update the database entry for this user
    db.collection('users').doc(req.user.handle).set(profileData, {merge: true})
        .then(() => {
            console.log(`${req.user.handle}'s profile info has been updated.`)
            return res.status(201).json({general: `${req.user.handle}'s profile info has been updated.`});
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).json({
                error: 'Error updating profile data'
            });
        })
};

exports.getUserDetails = (req, res) => {
    let userData = {};
    db.doc(`/users/${req.params.handle}`).get().then((doc) => {
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
