const router = require("express").Router();
const User = require("../model/User");
const { registerValidation, loginValidation } = require("../validation");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//const verify = require('./verifyToken');
// private Route  =====> router.post("/register", verify() ,async (req, res) => {

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

router.post("/login", async (req, res) => {
  //validation
  const { error } = loginValidation(req.body);
  if (error) {
    return res.status(400).send(error.details);
  } else {
    //check if already exist in db (must be Unique)
    const dbUser = await User.findOne({ email: req.body.email });
    if (!dbUser) {
      return res.status(404).send({ message: "Email does not exist." });
    }
    //Hashing the pass using Bcrypt
    const validPass = await bcrypt.compare(req.body.password, dbUser.password);
    if (!validPass) {
      return res.status(401).send({ message: "Invalid Email or password." });
    }
    // create token
    const token = jwt.sign(
      {
        id: dbUser._id,
        name: dbUser.name,
        email: dbUser.email,
      },
      process.env.TOKEN_SECRET,
      { expiresIn: "3h" }
    );
    res.header("token", token).send(token);
  }
});

module.exports = router;
