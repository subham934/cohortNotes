const express = require("express");
const authRouter = require("./routes/auth.routes");
const cookieParser = require("cookie-parser");
// 👉 cookie-parser is a middleware that reads the Cookie header from incoming requests
// 👉 And converts it into a usable JavaScript object: req.cookies


const app = express();
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRouter);


module.exports = app;
