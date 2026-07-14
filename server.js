const express = require("express");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.status(200).json({
        message: "Hello World!"
    });
});

app.get("/api/data", (req, res) => {
    const data = {
        id: 1,
        name: "John Doe",
        desc: "This is a description"
    }
    res.status(200).json(data);
});
app.listen(3000, () => {
    console.log("Server is running on port 3000");
})