import express from "express";

const app = express()

app.use(express.json())


app.get("/", (req, res)=>{
    res.send("Hello World!!")
})

app.get("/api/data", (req, res)=>{
    const data = {
        message: "This is a sample data from API",
        timestamp: new Date() 
    }

    res.json(data)
})

app.get("/api/users", (req, res)=>{
  const users = [
    {id: 1, name: "John Doe", email: "[EMAIL_ADDRESS]", role: "admin"},
    {id: 2, name: "Jane Doe", email: "[EMAIL_ADDRESS]", role: "user"},
    {id: 3, name: "Bob Smith", email: "[EMAIL_ADDRESS]", role: "user"},
  ]

  return res.status(200).json(users)   
})

export default app;

