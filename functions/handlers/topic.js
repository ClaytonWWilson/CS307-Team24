const { admin, db } = require("../util/admin");
exports.putTopic = (req, res) => {
  let new_following = [];
  let userRef = db.doc(`/users/${req.userData.handle}`);
  userRef.get().then(doc => {
    new_following = doc.data().followedTopics;
    new_following.push(req.body.following);

    // add stuff
    userRef
      .set({ followedTopics: new_following }, { merge: true })
      .then(doc => {
        return res
          .status(201)
          .json({ message: `Following ${req.body.following}` });
      })
      .catch(err => {
        return res.status(500).json({ err });
      });
    return res.status(200).json({ message: "OK" });
  });
};

exports.getAllTopics = (req, res) => {
  admin
    .firestore()
    .collection("topics")
    .get()
    .then(data => {
      let topics = [];
      data.forEach(function(doc) {
        topics.push({
          topic: doc.data().topic,
          id: doc.id
        });
      });
      return res.status(200).json(topics);
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: "Failed to fetch all topics." });
    });
};

exports.deleteTopic = (req, res) => {
  let new_following = [];
  let userRef = db.doc(`/users/${req.userData.handle}`);
  userRef.get().then(doc => {
    new_following = doc.data().followedTopics;
    // remove username from array
    new_following.forEach(function(follower, index) {
      if (follower === `${req.body.topic}`) {
        new_following.splice(index, 1);
      }
    });

    // update database
    userRef
      .set({ followedTopics: new_following }, { merge: true })
      .then(doc => {
        return res
          .status(202)
          .json({ message: `Successfully unfollow ${req.body.unfollow}` });
      })
      .catch(err => {
        return res.status(500).json({ err });
      });
    return res.status(200).json({ message: "ok" });
  });
};

// const topic = db.doc(`/topics/${req.params.topicId}`);
// topic
//   .get()
//   .then(doc => {
//     if (!doc.exists) {
//       return res.status(404).json({ error: "Topic not found" });
//     } else {
//       return topic.delete();
//     }
//   })
//   .then(() => {
//     return res.json({ message: "Topic successfully deleted!" });
//   })
//   .catch(err => {
//     console.error(err);
//     return res.status(500).json({ error: "Failed to delete topic." });
//   });
// };

exports.getUserTopics = (req, res) => {
  let data = [];
  db.doc(`/users/${req.body.handle}`)
    .get()
    .then(doc => {
      data = doc.data().followedTopics;
      return res.status(200).json({ data });
    })
    .catch(err => {
      return res.status(500).json({ err });
    });
};
