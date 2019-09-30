const { admin, db } = require('./admin');

// Acts as a middleman between the client and any function that you use it with
// The function will only execute if the user is logged in, or rather, they have
// a valid token
module.exports = (req, res, next) => {
    let idToken;
    
    // Checking that the token exists in the header of the request
    if (req.headers.authorization) {
        idToken = req.headers.authorization;
    } else {
        console.error('No token found');
        return res.status(403).json({ error: 'Unauthorized'});
    }

    // Checking that the token is valid in firebase
    admin.auth().verifyIdToken(idToken)
        .then((decodedToken) => {
            req.user = decodedToken;
            return db.collection('users').where('userId', '==', req.user.uid)
            .limit(1)
            .get();
        })
        .then((data) => {
            req.user.handle = data.docs[0].data().handle;  // Save username
            req.user.imageUrl = data.docs[0].data().imageUrl;
            return next();
        })
        .catch((err) => {
            console.error('Error while verifying token ', err);
            return res.status(403).json(err);
        });
};
