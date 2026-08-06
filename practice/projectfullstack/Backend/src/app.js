// const express = require("express"); // creating the server
// const noteModel = require("./models/note.model");

// const app = express();
// app.use(express.json());
// /**
//  * POST /api/notes
//  * create new note and save data in mongodb
//  * req.body - title, description
//  */

// app.post("/api/notes", async (req, res) => {
//   //   const { title, description } = req.body;
//   //   const note = await noteModel.create({ title, description });

//   //   res.status(201).json({ message: "Note ban gaya hai acche se", note });

//   const { title, description } = req.body;
//   const note = new noteModel({
//     title,
//     description,
//   });

//   note.save().then(() => {
//     res.status(201).json({ message: "Note ban gaya", note });
//   });
// });

// /**
//  * GET /api/notes
//  *
//  * Fetch data from mongodb and send them to response
//  */

// app.get("/api/notes", async function (req, res) {
//   const notes = await noteModel.find();

//   res.status(200).json({
//     message: "Notes fetched successfully",
//     notes,
//   });
// });

// /**
//  * /*
// DELETE /api/notes/:id
// delete the note with the given id from mongodb
// req.params.id = id of the note to be deleted
// */

// app.delete("/api/notes/:id", async (req, res) => {
//   const id = req.params.id;

//   await noteModel.findByIdAndDelete(id).then(() => {
//     res.status(200).json({ message: "Note deleted successfully" });
//   });
// });

// /**
//  * PATCH /api/notes/:id
//  * - update the description of the notes
//  * - req.body = {description}
//  *
//  */

// app.patch('/api/notes/:id', async (req, res)=>{
//     const id = req.params.id;
//     const {title, description} = req.body;

//     await noteModel.findByIdAndUpdate(id, {description});

//     res.status(200).json({
//         message: "Note updated successfully",
//         note: await noteModel.findById(id)
//     })
// })

// module.exports = app;

// =====================================

const express = require("express");
const noteModel = require("./models/note.model");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static(path.join( "./public")));



app.post("/api/notes", async (req, res) => {
  const { title, description } = req.body;

  const note = await noteModel.create({
    title,
    description,
  });

  res.status(201).json({
    message: "Notes created successfully",
    note,
  });
});

app.get("/api/notes", async (req, res) => {
  const notes = await noteModel.find();

  res.status(200).json({
    message: "Notes fetched successfully",
    notes,
  });
});

app.delete("/api/notes/:id", async (req, res) => {
  const id = req.params.id;

  await noteModel.findByIdAndDelete(id);

  res.status(200).json({
    message: "Note deleted successfully",
  });
});

// app.patch("/api/notes/:id", async (req, res) => {
//   const id = req.params.id;
//   const { description } = req.body;

//   await noteModel.findByIdAndUpdate(id, { description });
//   res.status(200).json({
//     message: "Note updated successfully",
//   });
// });


app.patch("/api/notes/:id", async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;  
  const note = await noteModal.findByIdAndUpdate(id, { title, description }, { new: true });

  res.status(200).json({  
    message: "Note updated successfully",
    note,
  });
});

app.use('*name', (req, res) => {
    res.sendFile(path.join(__dirname, "..", "/public/index.html"))      
})

module.exports = app;
