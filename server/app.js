require('dotenv').config();

const { search } = require('./search');
const { ingest, ingestGet } = require('./ingest');
const { upload } = require('./upload');

// Server
const cors = require('cors');
const express = require('express');
const app = express();
const port = 3001; // if you change this update the path in upload.js:27
app.use(cors());
app.use(express.static('public'));
app.use(express.json());
app.get('/', (req, res) => res.send('hey world'));

app.post('/ingest', ingest);
app.get('/ingest', ingestGet);
app.get('/search', search);
app.post('/upload', upload);

app.listen(port, () => console.log(`Listening on ${port}`));
