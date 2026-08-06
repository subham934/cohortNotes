// server ko start karna
// database se connect karna

const app = require("./src/app.js");
const mongoose = require("mongoose");

function connectDB() {
  mongoose
    .connect(
      "mongodb+srv://subham:EiFKHXezaOqVIoiW@cluster0.b7v3y6z.mongodb.net/day-90",
    )
    .then(() => {
      console.log("Connected to DB");
    })
    .catch((err) => {
      console.log("Error connecting to DB", err);
    });
}

connectDB();

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
