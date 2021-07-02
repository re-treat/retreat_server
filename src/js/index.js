const dbUtil = require("./dbUtil.js");
const { matchExercise } = require("./matching.js");
const storySharing = require('./storySharing');
const usernameUtil = require('./anonUsername.js');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const comment = require('./comment.js')

const app = express();

var corsConfig;
console.log(process.env.CORS);

if (process.env.CORS) {
  corsConfig = { origin: 'https://www.re-treat.app', }
}
else {
  corsConfig = { origin: '*', }
}
const PORT = process.env.PORT || 8081;


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

app.post('/log/', async (req, res) => {
  const {pageName,data} = req.body;
  const resp = await dbUtil.logVisit(pageName,data);
  res.status(200);
  res.send();
})

app.post('/story/create/', storySharing.createStoryView);
app.get('/story/query/', storySharing.queryStroyView);
app.get('/story/:storyId/',storySharing.getStoryByIdView);
app.post('/story/response/', storySharing.responseStoryView);
app.delete('/story/:storyId/', storySharing.deleteStoryByIdView);

/* Anonymous username */
app.post('/username/get', async(req, res) => {
  const count = req.body.count;
  const promise = usernameUtil.getRandomAvailableNames(count);
  promise.then(function(result) {
    console.log(result);
    res.status(200);
    res.send(result);
  }).catch(function(err){
    console.log(err);
    res.statusMessage = err;
    res.status(500);
    res.send();
  });
});

app.post('/username/register', async(req, res) => {
  const username = req.body.username;
  const promise = usernameUtil.registerName(count);
  promise.then(function(result) {
    console.log(result);
    res.status(200);
    res.send(result);
  }).catch(function(err){
    console.log(err);
    res.statusMessage = err;
    res.status(404);
    res.send();
  });
});

app.post('/username/unregister', async(req, res) => {
  const username = req.body.username;
  const promise = usernameUtil.unregisterName(count);
  promise.then(function(result) {
    console.log(result);
    res.status(200);
    res.send(result);
  }).catch(function(err){
    console.log(err);
    res.statusMessage = err;
    res.status(404);
    res.send();
  });
});

app.post('/username/add', async(req, res) => {
  const name = req.body.name;
  const promise = usernameUtil.addUsername(name);
  promise.then(function(result) {
    res.status(200);
    res.send(result);
  }).catch(function(err){
    console.log(err);
    res.statusMessage = err;
    res.status(500);
    res.send();
  });
});


app.post('comment/add', async(req, res) => {
  const {body, timestamp, userName, storyId, isCounselor} = req.body;
  if (body && timestamp && userName && storyId) {
    const result = await comment.createComment(body, timestamp, userName, storyId, isCounselor)
    if (result.success) {
      res.status(200)
      res.send(result)
      return
    }
  }
  res.status(400)
  res.send("Bad Request")
});


app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});
