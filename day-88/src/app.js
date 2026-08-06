// In BE folder structure is important

/*
-server create karna
-server ko configure karna
*/

const express = require('express');

const app = express(); /*server create ho jata hai*/

app.use(express.json()); /*body parser middleware use karna*/

const notes = [];

/*POST method /notes */

app.post('/notes', (req, res) => {
  console.log(req.body); //undefined aayega kyunki humne body parser middleware use nahi kiya hai, we need to use express.json() middleware to parse the JSON body of the request
  notes.push(req.body);
  console.log(notes);

  res.send('Note created successfully');
});

/*GET method /notes */
app.get('/notes', (req, res) => {
  res.json(notes);
});

/*Delete /notes */
/*params*/
/*delete /notes/3 */

app.delete('/notes/:index', (req, res) => {
  // console.log(req.params);
  // console.log(req.params.index);

  delete notes[req.params.index];
  res.send('Note deleted successfully');
});

/*
PATCH /notes/:index
req.body - {description: 'sample modified modification'}
*/

app.patch('/notes/:index', (req, res) => {
  notes[req.params.index].description = req.body.description;
  res.send('Note updated successfully');
});

app.get('/', (req, res) => {
  res.send('Hello World');
});

module.exports = app; /*server export karna*/
