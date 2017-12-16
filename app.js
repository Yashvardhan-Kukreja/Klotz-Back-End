/**
 * Created by Yash 1300 on 11-12-2017.
 */
var mongoose = require('mongoose');
var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var router = express.Router();
var userRoutes = require('./routes/userRoutes');


var port = process.env.PORT || 8000;
var app = express();

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use('/user', userRoutes(router));

mongoose.connect("mongodb://yashvardhan:yashvardhan@ds159776.mlab.com:59776/klotz");
mongoose.connection.on('error', function(){
    console.log("Error while connecting to the database");
});

mongoose.connection.on('connected', function(){
    console.log("Connected to the database successfully...");
});

app.listen(port, function () {
    console.log("App running successfully on port number: "+port+"...");
});

