const express = require("express");
var Datastore = require("nedb");

db = new Datastore({ filename: "database.db", autoload: true });
const port = process.env.PORT || 3001;
const app = express();
var cors = require("cors");
app.use(cors());

app.listen(port, () => {});

//app.use(express.static("public"));
app.use(express.json({ limit: "1mb" }));

// app.get("/getData/:name", (req, res) => {
//   var name = req.params.name;
//   db.find({ name: name }, (err, data) => {
//     res.json(data);
//   });
// });

app.get("/getData", (req, res) => {
  console.log(`getting timers array from db`);
  db.find({}, (err, data) => {
    res.json(data);
  });
});

app.post("/addTimer", (req, res) => {
  // var date = new Date();
  // var timestamp = Date.now();
  data = req.body;

  db.insert(data, function (err, insertValue) {
    console.log(`Timer with id:${insertValue._id} added`);
    res.json({
      _id: insertValue._id,
    });

    // numReplaced = 3
    // Field 'system' on Mars, Earth, Jupiter now has value 'solar system'
  });

  // console.log(res);
});

app.post("/updateTimer", (req, res) => {
  console.log("source path:", req.headers.origin);

  // var date = new Date();
  // var timestamp = Date.now();
  data = req.body;

  if (data.status === "D") {
    db.remove({ _id: data._id }, {}, function (err, numRemoved) {
      console.log(`Timer of id:[${data._id}] deleted`);
      res.json({
        st: numRemoved,
      });
    });
  } else {
    db.update(
      { _id: data._id },
      { $set: { startTime: data.startTime, status: data.status } },
      {},
      function (err, numReplaced) {
        console.log(
          `Timer of id:[${data._id}] updated to status:[${data.status}]`
        );
        res.json({
          st: numReplaced,
        });
      }
    );
  }

  // console.log(res);
});
