const express = require("express");
const app = express();
// import routes
const authRoute = require('./routes/auth');

//routes middleware 
app.use("/api ", authRoute);
 
app.listen(3000, () => console.log("aa server start"));
