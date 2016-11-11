/*
  ===========================================================================
                            Starting application
  ===========================================================================
*/
/* Core Modules */
var request = require('request');
var express = require('express');
var fs = require("fs");
var app = express();

// Configuração das rotas principais
app.use(express.static(__dirname));
app.use(express.static(__dirname + '/ai'));
app.use(express.static(__dirname + '/web'));
app.use(express.static(__dirname + '/views'));
app.use(express.static(__dirname + '/services'));
app.get('/', function(req, res) {
    res.send(fs.readFileSync("web/face.html", "utf8"));
})

// set the port of our application
// process.env.PORT lets the port be set by Heroku
var port = process.env.PORT || 8080;

var server = app.listen(port, function() {
    console.log("Example app listening at %s", server.address().port)
})

app.get('/instagram', function(req, res) {
    request.get('http://www.instagram.com/' + req.query.username + '/?__a=1', function(error, response, body) {
        if (!error && response.statusCode == 200)
            res.send(body);
        else res.send(error);
    });
});

module.exports = app;