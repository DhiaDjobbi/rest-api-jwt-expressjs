const jwt = require("jsonwebtoken");
const checkAuth = (req, res, next) => {
  const token = req.header("token");
  if (!token) {
    return res.status(401).send("Access Denied");
  } else {
    try {
      const verified = jwt.verify(token, process.env.TOKEN_SECRET);
      req.user = verified;
      next();
    } catch (error) {
      res.status(401).send("Invalid Token");
    }
  }
};
module.exports= checkAuth;