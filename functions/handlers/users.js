const {db} = require('../util/admin');
const {validateUpdateProfileInfo} = require('../util/validator');

exports.getProfileInfo = (req, res) => {
    // FIXME: Delete this after login is implemented
    req.user = {};
    req.user.handle = 'itsjimmy';

    db.collection('users').doc(req.user.handle).get()
        .then((data) => {
            return res.status(200).json(data.data());
        });
};

exports.updateProfileInfo = (req, res) => {
    // FIXME: Delete this after login is implemented
    req.user = {};
    req.user.handle = 'itsjimmy';

    // TODO: Add functionality for adding/updating profile images

    // ?: Should users be able to change their handles?
    const profileData = {
        firstName: req.body.firstName.trim(),   // Can be empty
        lastName: req.body.lastName.trim(),     // Can be empty
        email: req.body.email.trim(),           // Cannot be empty
        bio: req.body.bio.trim(),               // Can be empty
    };
    
    // Data validation
    const {valid, errors} = validateUpdateProfileInfo(profileData);
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