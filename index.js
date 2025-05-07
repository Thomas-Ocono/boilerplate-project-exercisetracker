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

//create users
const userSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
});
const userModel = mongoose.model("Users", userSchema);

app.post("/api/users", (req, res) => {
  const name = req.body.username;
  const user = new userModel({
    username: name,
  });
  user
    .save()
    .then((result) => {
      console.log("New User added!");
      res.send(user);
    })
    .catch((err) => {
      console.log("Error saving user");
      console.log(err);
    });
});

//add exercises to user
const exerciseSchema = new Schema({
  id: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
});
const exerciseModel = mongoose.model("Exercises", exerciseSchema);

app.post("/api/users/:_id/exercises", (req, res) => {
  const inputId = req.params._id;
  const exerciseDescription = req.body.description;
  const exerciseDuration = req.body.duration;
  let exerciseDate = req.body.date;
  if (!exerciseDate) {
    let currentDate = new Date();
    exerciseDate = currentDate.toDateString();
  }

  console.log(
    "id: " +
      inputId +
      "| Description: " +
      exerciseDescription +
      "| Duration: " +
      exerciseDuration +
      "| Date: " +
      exerciseDate
  );
  const newExercise = new exerciseModel({
    id: inputId,
    description: exerciseDescription,
    duration: exerciseDuration,
    date: exerciseDate,
  });
  newExercise
    .save()
    .then((result) => {
      console.log("New Exercise Added!");
      res.send(newExercise);
    })
    .catch((err) => {
      console.log("Error saving exercise");
      console.log(err);
    });
});

app.get("/api/users", async (req, res) => {
  let allUsers;
  allUsers = await userModel.find({});
  res.send(allUsers);
});

const listener = app.listen(process.env.PORT || 3500, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
