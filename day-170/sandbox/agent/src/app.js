import express from "express"
import morgan from "morgan"
import fs from "fs";



const WORKING_DIR = "/workspace" // this is the working directory, because it is the only folder that is accessible to this agent and also the container


const app = express()

app.use(morgan("dev"))

app.get("/", (req, res)=>{
    res.status(200).json({
        message: "Hello from Sandbox agent!!",
        status: "success"
    })
})

app.get("/list-files", async (req, res)=>{
    const elements = await fs.promises.readdir(WORKING_DIR);
    return res.status(200).json({
        message: "Elements in working directory",
        elements
    })
})


export default app