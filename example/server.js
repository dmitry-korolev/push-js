var express = require('express');
var path = require('path');
var port = 5001;

var app = express();
app.use(express.static(path.resolve(__dirname)));
app.use(express.static(path.resolve(__dirname + '/../dist')));
app.listen(port);

