let app = require("./src/app");
let connectDB = require("./src/config/db");
require("dotenv").config();

connectDB();

let port = process.env.PORT || 3000; 

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});