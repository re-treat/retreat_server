const dbUtil = require("./dbUtil.js");
const { matchExercise } = require("./matching.js");
const storySharing = require('./storySharing');
const express = require('express');
const cors = require("cors");
const bodyParser = require('body-parser');

const app = express();

const corsConfig = {
  //origin: '*',
  origin: 'https://www.re-treat.app',
}

app.use(cors(corsConfig));
app.use(bodyParser.json());


app.get('/', (req, res) => {
  res.send('Hello World! Welcome to Re:treat')
});

app.post('/addExercise', async (req, res) => {
  const name = req.body.name;
  const file = req.body.file;
  const labels_q1 = req.body.labels_q1;
  const labels_q2 = req.body.labels_q2;
  const labels_q3 = req.body.labels_q3;

  const promise = dbUtil.addExercise(name, file, labels_q1, labels_q2, labels_q3);
  promise.then(function (value) {
    res.status(200);
    res.send("Added Exercise successfully!");
  }, function (value) {
    console.log("error in adding exercise to db");
    res.status(500);
    res.send("Failed to add exercise");
  });
});

app.post('/matchExercise', async (req, res) => {
  const labels_q1 = req.body.labels_q1;
  const labels_q2 = req.body.labels_q2;
  const labels_q3 = req.body.labels_q3;
  const size = req.body.size;

  const promise = matchExercise(labels_q1, labels_q2, labels_q3, size);
  promise.then(function (value) {
    console.log("Queried exercises succesfully!");
    console.log(value);
    res.status(200);
    res.send(value);
  }, function (value) {
    console.log("error in querying db for exercises");
    res.status(500);
    res.send("Failed to add exercise");
  });
});


app.post('/getLabels', async(req, res) => {
  const question = req.body.question;
  const promise = dbUtil.getLabels(question);
  promise.then(function (value){
    console.log(value);
    res.status(200);
    res.send(value);
  }).catch(function(err){
    console.log("error getting labels");
    res.status(500);
    res.send("Failed to get labels");
  });
 });

app.post('/getExercise', async(req, res) => {
  const id = req.body.id;
  console.log(id);
  const promise = dbUtil.getExercise(id);
  promise.then(function(value) {
    console.log(value);
    console.log("success");
    res.status(200);
    res.send(value);
  }).catch(function(err){
    console.log("failed");
    res.status(500);
    res.send(err);
  });
});

app.post('/subscribe', async(req, res) => {
  const email = req.body.email;
  const promise = dbUtil.subscribe(email);
  promise.then(function(result) {
    console.log(result);
    res.status(200);
    res.send();
  }).catch(function(err){
    console.log(err);
    res.statusMessage = err;
    res.status(500);
    res.send();

  });
});

app.post('/story/create/', storySharing.createStoryView);
app.get('/story/query/', storySharing.queryStroyView);
app.get('/story/:storyId/',storySharing.getStoryByIdView);
app.delete('/story/:storyId/', storySharing.deleteStoryByIdView);


const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});
