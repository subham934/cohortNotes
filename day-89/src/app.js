/*
server ko create karna
server ko config karna
*/

const express = require("express");
const app = express();

app.use(express.json()); /*json data ko read karne ke liye middleware use karna*/

const notes = [];

/*POST  /notes*/
app.post("/notes", (req, res) => {
  console.log(req.body);
  notes.push(req.body);
  res.status(201).json({
    message: "Note added successfully",
  });
});


app.get("/notes", function(req, res){
    res.status(200).json({
        notes:notes
    })
})


app.delete("/notes/:mama",(req, res)=>{
    delete notes[req.params.mama]

    // res.status(204).json({
    //     message:"Note deleted successfully"
    // })
    // with 204 , we cannot send any response body, so we can only send status code without any message , so the notes with perticular index will be deleted but we cannot send any response body with 204 status code, so we can only send status code without any message
    res.status(200).json({
        message:"Note deleted successfully"
    })  
})


app.patch("/notes/:id",(req, res)=>{     
    notes[req.params.id].description = req.body.description;

    res.status(200).json({ 
        message:"Notes description updated successfully"
     })
 })

app.get("/", (req, res) => {
  res.send("Hello World");
});

module.exports = app;  
