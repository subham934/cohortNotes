// const express = require("express");

// const app = express();
// app.use(express.json());

// const notes = [];

// app.get("/", (req, res) => {
//   res.send("Hello World from the land of India");
// });

// app.post("/notes", function (req, res) {
//   console.log(req.body);
//   notes.push(req.body);
//   res.send("Notes created successfully");
// });

// app.get("/notes", function (req, res) {
//   // res.send(notes)
//   res.json(notes);
// });

// app.delete("/notes/:idx", function (req, res) {
//   // delete notes[req.params.idx] // if we delete in this way , the object will remain but the value will be null

//   notes.splice(req.params.idx, 1); // here, the entire object will be deleted
//   res.send("Note deleted successfully", notes);
// });

// app.patch("/notes/:idx", function (req, res) {
//   // notes[req.params.idx] = req.body; // if we write like this , we need to change both the title and the description or else if we only change one of them , the other one automatically get removed

//   notes[req.params.idx].description = req.body.description; // if we write like this , we can change only the description

//   res.send("Note updated successfully");
// });

// app.put('/notes/:idx', function (req, res) {
//   notes[req.params.idx] = req.body;
//   res.send("Note updated successfully");
// });

// module.exports = app;

// =======================================

// const express = require("express");

// const app = express();

// app.use(express.json());

// const notes = [];

// app.post("/notes", (req, res) => {
//   console.log(req.body);
//   notes.push(req.body);
//   res.status(201).json({
//     message: "Note added successfully",
//     notes,
//   });
// });

// app.get("/notes", function (req, res) {
//   res.status(200).json({
//     notes,
//   });
// });

// app.delete("/notes/:ind", (req, res) => {
//   delete notes[req.params.ind];

//   res.status(200).json({
//     message: "Note deleted successfully",
//     notes,
//   });
// });

// module.exports = app;

// ========================================

// server create karna
// server config karna

const express = require("express");
const noteModel = require("./models/notes.model.js");

const app = express();
app.use(express.json());

app.post("/notes", async function (req, res) {
  const { title, description } = req.body;
  const note = await noteModel.create({ title, description });
  res.status(201).json({
    message: "Notes created successfully",
    note,
  });
});



app.get('/notes', async (req, res)=>{
    const notes = await noteModel.find()
    res.status(200).json({
        message: "Notes fetched successfully",
        notes
    })
})


module.exports = app;
