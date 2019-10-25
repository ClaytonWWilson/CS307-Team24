/* eslint-disable promise/always-return */
const admin = require('firebase-admin');
exports.putTopic = (req, res) => {

    const newTopic = {
        topic: req.body.topic
    };

    admin.firestore().collection('topics').add(newTopic)
    .then((doc) => {
        const resTopic = newTopic;
        return res.status(200).json(resTopic);
    })
    .catch((err) => {
        console.error(err);
        return res.status(500).json({ error: 'something is wrong'});
    });
};



exports.getAllTopics = (req, res) => {
    admin.firestore().collection('topics').get()
    .then((data) => {
        let topics = [];
        data.forEach(function(doc) {
            topics.push(doc.data());
        });
        return res.status(200).json(topics);
    })
    .catch((err) => {
        console.error(err);
        return res.status(500).json({error: 'Failed to fetch all posts written by specific user.'})
    })
};