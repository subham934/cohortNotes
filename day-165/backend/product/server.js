import express from "express";
import morgan from "morgan";
import axios from "axios";


const app = express();

app.use(morgan("dev"));
app.use(express.json());


app.get("/api/product", async (req, res)=>{
    const response = await axios.get("http://main-server-service/"); // this http://main-server-service/ means that we have created a service called main-server-service (check service.yml), so, now we are creating a server that calls this service and then return the response.  
    res.send(response.data);
})

app.listen(8080, () => {
    console.log("Server is running on port 8080");
})