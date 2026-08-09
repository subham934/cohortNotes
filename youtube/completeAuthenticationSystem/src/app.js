import express from "express";
import morgan from "morgan";
import authRouter from "./routes/auth.routes.js";


const app = express();

app.use(express.json()); // middleware to parse json data
app.use(morgan("dev"));


// routes
app.use("/api/auth",authRouter)




export default app;