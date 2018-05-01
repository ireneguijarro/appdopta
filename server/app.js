const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const users = require('./routes/users');
const auth = require('./routes/auth');

let app = express();

app.use(cors());
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ extended: true }, {limit: '50mb'}));
app.use('/img', express.static('./public'));
app.use('/users', users);
app.use('/auth', auth);

app.listen(8080);