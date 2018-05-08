const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const users = require('./routes/users');
const auth = require('./routes/auth');
const animals = require('./routes/animals');

let app = express();

app.use(cors());
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ extended: true }, {limit: '50mb'}));
app.use('/img', express.static('./public'));
app.use('/user', users);
app.use('/auth', auth);
app.use('/animal', animals);

app.listen(8080);