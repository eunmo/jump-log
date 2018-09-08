const express = require('express');
const path = require('path');

const app = express();
const routes = require('./routes/index');

// Serve static assets
app.use(express.static(path.join(__dirname, '../build')));
app.use(express.static(path.join(__dirname, '../img')));

app.use(express.json());

app.use('/', routes);

module.exports = app;
