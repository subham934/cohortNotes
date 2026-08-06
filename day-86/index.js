const express = require("express");

const app = express(); // server instance create karna

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/about", (req, res) => {
  res.send("This is about page");
});

app.get("/product", (req, res) => {
  res.send("This is product page");
});

app.listen(3000, () => console.log("Server is running on port 3000")); // server start

// - `express()` → creates the server
// - `app.get()` → handles GET requests
// - `req` → request object (data from user)
// - `res` → response object (data sent back)
// - `listen()` → starts the server
