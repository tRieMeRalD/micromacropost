const express = require("express");
const mongodb = require("mongodb");

const router = express.Router();
const keys = require("../../config/keys");

// Gets posts
router.get("/", async (req, res) => {
  // Retrieve post collection to work with
  const posts = await loadPostsCollection();

  // Get all posts
  res.send(await posts.find({}).toArray());
});

// Add posts
router.post("/", async (req, res) => {
  const posts = await loadPostsCollection();

  await posts.insertOne({
    text: req.body.text,
    createdAt: new Date()
  });

  // 201 = Status OK + sent some info
  res.status(201).send();
});

// Delete
router.delete("/:id", async (req, res) => {
  const posts = await loadPostsCollection();

  await posts.deleteOne({ _id: new mongodb.ObjectID(req.params.id) });
  res.status(200).send();
});

async function loadPostsCollection() {
  const client = await mongodb.MongoClient.connect(`${keys.password}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  return client.db("vuejs").collection("posts");
}

module.exports = router;
