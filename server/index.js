const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

const fs = require('node:fs');
const dictionaryData = require('./dictionary_data/frequency_dictionary_data.json');

app.get('/dictionary', (req, res) => {
  res.json(dictionaryData);
});

app.use(express.static('./public'));

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});