var express = require('express');
var path = require('path');

var app = express();
app.use(express.static(path.resolve(__dirname)));
app.listen(5000);
