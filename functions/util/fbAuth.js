const { admin, db } = require('./admin');

// Acts as a middleman between the client and any function that you use it with
// The function will only execute if the user is logged in, or rather, they have
// a valid token
module.exports = (req, res, next) => {
    console.log(req);
    console.log(req.body);
    console.log(req.headers);
    console.log(req.headers.authorization);
    console.log(JSON.stringify(req.body));
    console.log(JSON.stringify(req.header));

    let idToken;
    
    // Checking that the token exists in the header of the request
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        idToken = req.headers.authorization.split('Bearer ')[1];
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
            req.userData = data.docs[0].data();  // Stores all user data from the database
            return next();
        })
        .catch((err) => {
            console.error('Error while verifying token ', err);
            return res.status(403).json(err);
        });
};
