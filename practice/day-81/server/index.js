const express = require("express");

const app = express();

app.get("/data", (req, res) => {
  const dummy = [
    {
      username: "Shubham",
      city: "Bhopal",
      age: 31,
    },
  ];
 res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173").json({ data: dummy });

});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
