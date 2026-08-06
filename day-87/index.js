// const express = require('express');

// const app = express();

// app.get('/', (req, res) => {
//   res.send('Hello World!!!');
// });

// app.get('/home', (req, res) => {
//   res.send('This is Home Page!!!');
// });

// app.get('/about', (req, res) => {
//   res.send('This is About Page!!!');
// });

// app.listen(3000, () => {
//   console.log('Server is running on port 3000');
// })

// an API is a set of rules and protocols that allows different software applications to communicate with each other. It defines how requests and responses should be structured, what data can be accessed, and how the interactions should occur. APIs enable developers to integrate different services, access data, and perform various operations without needing to understand the underlying code or infrastructure of the other application. They are essential for building modern web applications, mobile apps, and connecting various software systems together.

// ==========================================

const express = require("express");
const app = express();

app.use(express.json()); // is line se hum express ko batate hain ki hum json format mein data bhej rahe hain, aur express usko samajh kar process karega. Isse hum apne API mein JSON data ko easily handle kar sakte hain.

const notes = [];

app.post("/notes", (req, res) => {
  console.log(req.body);
  notes.push(req.body);
  res.send("Note created successfully on notes.");
});

app.get("/notes", (req, res) => {
  res.send(notes);
});

app.listen(3000, function () {
  console.log("Server is running on port 3000");
});

// yaha app.use(express.json()) ka use karte hain ki hum apne API mein JSON data ko easily handle kar sakte hain.

// Jab tum Postman se POST request bhejte ho aur body me JSON data dete ho, to app.use(express.json()) Express ko bolta hai ki incoming JSON body ko read aur parse karo, phir us parsed data ko req.body me store kar do, taaki route ke andar tum easily req.body.title, req.body.description jaisi values use kar sako; agar ye middleware na ho to JSON parse nahi hota aur req.body generally undefined milta hai.
