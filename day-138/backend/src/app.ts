import express from 'express';
import runGraph from './ai/graph.ai.js';
import cors from 'cors';
import { success } from 'zod';

const app = express();


app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173', // Adjust this to match your frontend's URL
  methods: ['GET, POST'],
  credentials: true,
}));

app.get('/', async (req, res) => {
  try {
    const result = await runGraph('write a code for factorial function in JS');
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(503).json({
      error: 'AI model is temporarily unavailable. Please try again later.',
    });
  }
});

app.post('/battle', async (req, res) => {
  try {
    const { problem } = req.body;

    const result = await runGraph(problem);

    // res.json(result);


    res.status(200).json({
      message: "Graph executed successfully",
      success: true,
      result,
    })
  } catch (error) {
    console.error(error);
    res.status(503).json({
      error: 'AI model is temporarily unavailable. Please try again later.',
    });
  }
});

export default app;
