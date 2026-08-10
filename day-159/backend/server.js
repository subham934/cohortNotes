import express from 'express';
import morgan from 'morgan';
import cors from 'cors';

const app = express();

app.use(express.json()); // Parse JSON request bodies
app.use(morgan('dev')); // Log HTTP requests

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK!',
  });
});

app.get('/api/hello', (req, res) => {
  res.status(200).json({ message: 'Hello, World!' });
});

app.get('/api/users', (req, res) => {
  const users = [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' },
    { id: 3, name: 'Charlie' },
    { id: 4, name: 'Ankur' },
    { id: 5, name: 'Ronny' },
    { id: 6, name: 'Dolly' },
    { id: 7, name: 'Monu' },
    { id: 8, name: 'Khushbu' },
  ];
  res.status(200).json(users);
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
