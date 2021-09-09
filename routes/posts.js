const router = require("express").Router();
const Post = require("../model/Post");
const { newPostValidation, editPostValidation } = require("../validation");

router.get("/", async (req, res) => {
  try {
    const posts = await Post.find();
    res.send(posts);
  } catch (error) {
    res.status(500).send(err);
  }
});
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.send(post);
  } catch (error) {
    res.status(404).send({ message: "Post not found" });
  }
});
router.post("/new", async (req, res) => {
  //validation
  const { error } = newPostValidation(req.body);
  if (error) {
    return res.status(400).send(error.details);
  } else {
    const post = new Post({
      title: req.body.title,
      description: req.body.description,
    });
    const savedPost = await post.save();
    res.send(savedPost);
  }
});

router.put("/:id", async (req, res) => {
  //validation
  const { error } = editPostValidation(req.body);
  if (error) {
    return res.status(400).send(error.details);
  } else {
    const id = req.params.id;

    try {
      const post = await Post.findById(id);
      if (post !== null) {
        try {
          const updatedPost = await Post.updateOne(
            { _id: id },
            {
              $set: {
                title: req.body.title,
                description: req.body.description,
              },
            }
          );
          if (updatedPost.modifiedCount > 0) {
            res.status(200).send({ message: "Successfully updated the post." });
          } else {
            res.status(200).send({ message: "Nothing to update." });
          }
        } catch (error) {
          res.status(500).send(error);
        }
      } else {
        res.status(404).send({ message: "Post not found" });
      }
    } catch (error) {
      res.status(404).send({ message: "Post not found" });
    }
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const removedPost = await Post.remove({ _id: req.params.id });
    if (removedPost.deletedCount > 0) {
      res.status(200).send({ message: "Successfully removed the post." });
    } else if (removedPost.deletedCount === 0) {
      res.status(404).send({ message: "Post not found" });
    }
  } catch (error) {
    res.status(404).send({ message: "Post not found" });
  }
});

module.exports = router;
