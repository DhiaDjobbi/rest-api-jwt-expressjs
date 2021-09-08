const express = require("express");
const mongoose = require("mongoose");
const app = express();
const dotenv = require("dotenv");

// import routes
const authRoute = require("./routes/auth");


dotenv.config();

//connect to db
mongoose.connect(process.env.DB_CONNECT, () => {
  console.log("connected to db");
});

// allow sending post request
app.use(express.json());

// api prefix
app.use("/api", authRoute);

app.listen(3000, () => console.log("aa server start"));
