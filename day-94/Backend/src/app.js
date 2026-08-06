// server ko create karna
// server ko config karna

const express = require("express");
const noteModal = require("./models/note.model");
const app = express();
const cors = require("cors");
const path = require("path");

app.use(cors());
app.use(express.json());

// app.use(express.static(path.join(__dirname, "..", "public")));
app.use(express.static(path.join("./public")));

/*
POST /api/notes
create new note and save data in mongodb
req.body = title, description
*/

app.post("/api/notes", async (req, res) => {
  const { title, description } = req.body;
  // save data in mongodb
  const note = await noteModal.create({ title, description });

  res.status(201).json({
    message: "Note created successfully",
    note,
  });
});

/*
GET /api/notes
fetch all the notes from mongodb and send to client
*/

app.get("/api/notes", async (req, res) => {
  const notes = await noteModal.find({});
  res.status(200).json({
    message: "Notes fetched successfully",
    notes,
  });
});

/*
DELETE /api/notes/:id
delete the note with the given id from mongodb
*/

app.delete("/api/notes/:id", async (req, res) => {
  const { id } = req.params;

  await noteModal.findByIdAndDelete(id);

  res.status(200).json({
    message: "Note deleted successfully",
  });
});

/*
PATCH /api/notes/:id  
it will update the note with the given id in mongodb
req.body = title, description
*/

app.patch("/api/notes/:id", async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;
  const note = await noteModal.findByIdAndUpdate(
    id,
    { title, description },
    { new: true },
  );

  res.status(200).json({
    message: "Note updated successfully",
    note,
  });
});


app.use("*name", (req, res) => {
  // res.status(404).json({
  //   message: "This is wild card route, page not found",
  // });

  // res.sendFile(__dirname + "/index.html"); // wrong procedure, will give error when we deploy the app in server because in server __dirname will be different, so we need to give the absolute path of the file, for that we can use path module of nodejs

  // res.status(404).sendFile("D:/CODED/STUDY/cohort-2/day-94/Backend/public/index.html");

  // we can do the above or do the below to show the error page when user enter wrong url, for that we need to use const path = require("path");

  // res.sendFile(path.join(__dirname, '../public/index.html'))
  res.sendFile(path.join(__dirname, "..", "/public/index.html"));
});



// so now, if we go to browser and hit the url http://localhost:3000/ we would get, index.html file which is in public folder, becase of the code as
// res.sendFile(path.join(__dirname, "..", "/public/index.html"))

// in the index.html there are two more files: 1. css file 2. js file, and it request to get both the files, in the form of

// http://localhost:3000/assets/index-DSLQX9F0.js and http://localhost:3000/assets/index-C0n4HQ3g.css

// as we have coded the server in such a way that when we hit any url that is not programmed we get index.html file, so when we hit the url http://localhost:3000/assets/index-DSLQX9F0.js we get index.html file instead of the js file and same for css file, and because of that our app is not working, to solve this problem we need to tell the server that if the request is for js or css file then send the js or css file instead of index.html file, for that we can use express.static middleware as below

// app.use(express.static(path.join(__dirname, "..", "public")));

// OR

// app.use(express.static(path.join( "./public")));

// Now the entire frontend is deployed in backend and when we hit the url http://localhost:3000/ we get the index.html file and when we hit the url http://localhost:3000/assets/index-DSLQX9F0.js we get the js file and when we hit the url http://localhost:3000/assets/index-C0n4HQ3g.css we get the css file, and because of that our app is working fine.

module.exports = app;
