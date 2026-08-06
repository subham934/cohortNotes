import express from "express";
import useGraph from "./services/graph.ai.service.js";

const app = express()


app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' })
})

app.post("/use-graph", async (req, res) => {
    try {
        const result = await useGraph("write a factorial function in javascript")
        res.status(200).json({ messages: result })
    } catch (error) {
        res.status(500).json({ error: String(error) })
    }
})

export default app