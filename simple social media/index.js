const express = require("express");
const app = express();
const cors = require("cors");
const postRoute = require("./routes/post");
const replyRoute = require("./routes/reply");
//*********************//
app.use(cors());
app.options("*", cors());
app.use(express.json()); /* bodyParser.json() is deprecated */

// parse requests of content-type - application/x-www-form-urlencoded
app.use(
  express.urlencoded({ extended: true })
); /* bodyParser.urlencoded() is deprecated */

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Handy App application." });
});
app.use("/api/", postRoute);
app.use("/api/", replyRoute);
// set port, listen for requests
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
