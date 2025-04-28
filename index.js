const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const dbURI = process.env.URI;
const bodyParser = require("body-parser");

mongoose
  .connect(dbURI)
  .then((result) => console.log("connected to db"))
  .catch((err) => console.log(err));

app.use(cors());
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

const testSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  age: Number,
});

const testModel = mongoose.model("Test", testSchema);

app.get("/api", (req, res) => {
  const testInput = new testModel({
    name: "test1",
    age: 25,
  });
  testInput
    .save()
    .then((result) => {
      res.send(result);
      console.log("save success!");
    })
    .catch((err) => console.log(err));
});

const listener = app.listen(process.env.PORT || 3500, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
