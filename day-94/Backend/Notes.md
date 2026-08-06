// we can store anything inside the database and we can retrieve it whenever we want, but to store and retrieve data we need to create a schema and model for that data, so that we can use that model to store and retrieve data from the database.

here , we have created a format (schema) as below in note.model.js

const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
  title: String,
  description: String,
})

const noteModal = mongoose.model("notes", noteSchema);

module.exports = noteModal;



// let say we are in frontend and we want to fetch all the notes from backend and show it in frontend for that we will use useEffect and fetch the api to get the data from backend and set it in state and then show it in frontend, to fetch data from backend we use axios.


<!-- This below is cors policy -->
http://localhost:3000/api/notes' from origin 'http://localhost:5173' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.




// so now, if we go to browser and hit the url http://localhost:3000/ we would get, index.html file which is in public folder, becase of the code as   
// res.sendFile(path.join(__dirname, "..", "/public/index.html"))  

// in the index.html there are two more files: 1. css file 2. js file, and it request to get both the files, in the form of  

// http://localhost:3000/assets/index-DSLQX9F0.js and http://localhost:3000/assets/index-C0n4HQ3g.css

// as we have coded the server in such a way that when we hit any url that is not programmed we get index.html file, so when we hit the url http://localhost:3000/assets/index-DSLQX9F0.js we get index.html file instead of the js file and same for css file, and because of that our app is not working, to solve this problem we need to tell the server that if the request is for js or css file then send the js or css file instead of index.html file, for that we can use express.static middleware as below

// app.use(express.static(path.join(__dirname, "..", "public")));

// OR

// app.use(express.static(path.join( "./public")));

