/* eslint-disable promise/always-return */
const { admin, db } = require("../util/admin");
exports.putTopic = (req, res) => {

    const newTopic = {
        topic: req.body.topic
    };

    admin.firestore().collection('topics').add(newTopic)
    .then((doc) => {
        const resTopic = newTopic;
        newTopic.topicId = doc.id;
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
        return res.status(500).json({error: 'Failed to fetch all topics.'})
    })
};

exports.deleteTopic = (req, res) => {
    // TODO: handle add and delete by topic id
    const topic = db.doc(`/topics/${req.params.topicId}`);
    topic.get().then((doc) => {
        if (!doc.exists) {
            return res.status(404).json({error: 'Topic not found'});
        } else {
            return topic.delete();
        }
    })
    .then(() => {
        res.json({ message: 'Topic successfully deleted!'});
    })
    .catch((err) => {
        console.error(err);
        return res.status(500).json({error: 'Failed to delete topic.'})
    })
}