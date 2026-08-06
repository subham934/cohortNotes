// server ko create krna
// server ko config krna

const express = require("express");
const noteModel = require("./models/note.model.js");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

/*
POST /api/notes
create new note and save data in mongodb
req.body = title, description
*/

app.post("/api/notes", async (req, res) => {
  const { title, description } = req.body;
  // niche teen tarike hain ek naya note create karne ke liye aur usko database mein save karne ke liye. Aap apni pasand ke hisab se kisi bhi tarike ka use kar sakte hain.
  //   ================================

  // const note = new noteModel({
  //   title,
  //   description,
  // });
  // // save this data in mongodb
  // note.save().then(() => {
  //   res.status(201).json({ message: "Note created successfully" });
  // });

  //   ================================

  //   const note = await noteModel
  //   .create({
  //     title,
  //     description,
  //   })
  //   .then(() => {
  //     res.status(201).json({ message: "Note bilag create hoi gol"  });

  //   })
  //   .catch((err) => {
  //     res.status(500).json({ message: "Error creating note", error: err });
  //   });

  //   ================================
  const note = await noteModel.create({
    title,
    description,
  });
  res.status(201).json({ message: "Note ban gaya hai acche se", note });
});

app.get("/api/notes", async (req, res) => {
  const notes = await noteModel.find();
  res.status(200).json({ message: "Notes fetched successfully", notes });
});

/*
DELETE /api/notes/:id
delete the note with the given id from mongodb
req.params.id = id of the note to be deleted
*/

app.delete("/api/notes/:id", async (req, res) => {
  const id = req.params.id;
  await noteModel.findByIdAndDelete(id);
  res.status(200).json({ message: "Note deleted successfully" });
});

/*
 * - PATCH /api/notes/:id
 * - update the description of the notes
 * - req.body = {description}
 */

app.patch("/api/notes/:id", async (req, res) => {
  const id = req.params.id;
  const { description } = req.body;

  await noteModel.findByIdAndUpdate(id, { description });
  res.status(200).json({
    message: "Note updated successfully",
  });
});

// for those api request which are not defined in our server, we can use wildcard route to handle those requests and send a response to the client.

app.use("*name", (req, res) => {
  // res.send("this is wild card")
  // we can use the above code or the below code to send a response to the client for those api request which are not defined in our server.
  res.sendFile(path.join(__dirname, "..", "../public/index.html"));
});

module.exports = app;