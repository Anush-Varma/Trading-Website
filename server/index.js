const express = require("express");
const app = express();
const port = 8080;

const cors = require("cors");
app.use(cors());

// TO DO: Do a get request to get API for stocks and data and
// use polygon.io for data
// use data to display to frontend

app.get("/", (req, res) => {
  res.send("Working");
});

// This is where you define routes for the application GET, POST ...

app.listen(port, () => {
  console.log("Server has started on port 8080");
});
