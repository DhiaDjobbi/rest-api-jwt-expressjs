const router = require("express").Router();
const User = require("../model/User");
const { registerValidation, loginValidation } = require("../validation");
const bcrypt = require("bcryptjs");

router.post("/register", async (req, res) => {
  //validation
  const { error } = registerValidation(req.body);
  if (error) {
    return res.status(400).send(error.details);
  } else {
    //check if already exist in db (must be Unique)
    const emailExist = await User.findOne({ email: req.body.email });
    if (emailExist) {
      return res.status(400).send({ message: "Email already exists" });
    }
    //Hashing the pass using Bcrypt

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    //creating new user
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    });
    try {
      const savedUser = await user.save();
      // removing the password from the responce
      const user2 = JSON.parse(JSON.stringify(savedUser));
      delete user2.password;
      res.send(user2);
    } catch (error) {
      res.status(400).send(err);
    }
  }
});

module.exports = router;
