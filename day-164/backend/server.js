import express from "express";
import morgan from "morgan";


const app = express()

app.use(express.json())
app.use(morgan('dev'))


app.get('/', (req, res) => {
    let sum = 0;
    for(let i = 0; i < 1000000000; i++) {
        sum += i;
    }
    res.status(200).json(`Hello World! Sum is ${sum}`)
})


const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})