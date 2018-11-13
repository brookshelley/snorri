// server.js
const tinyspeck = require('tinyspeck');
const express = require('express');
const request = require('request');
require('dotenv').config() 
var app = express();
const slack = tinyspeck.instance({
    token: process.env.SLACK_ACCESS_TOKEN
});
var http = require('http');


const yells = ['mreowww', 'wuoooahh', 'broo?', 'wooah', 'mwow?'];

const getYells = function () {
    return yells[Math.floor(Math.random() * yells.length)];
}

slack.on('/snorri', function (event) {
  if (event.text == 'food') {  
    const response_url = event.response_url;
    slack.send(response_url, {
        response_type: "in_channel",
        text: getYells()
    })
  }
  else if (event.text == 'sleepies') {
    const response_url = event.response_url;
    slack.send(response_url, {
        response_type: "in_channel",
        text: '_blinks_'
    })
  }
  else {
    const response_url = event.response_url;
    slack.send(response_url, {
        response_type: "in_channel",
        text: '_stares at you_'
    })
  }
});

slack.on('*', event => { console.log(event) });

slack.listen(process.env.PORT, process.env.SLACK_ACCESS_TOKEN);

http.createServer(onRequest_a).listen(9011);

function onRequest_a (req, res) {
  res.write('Response from 9011\n');
  res.end();
}

// listen for requests :)
var listener = app.listen(onRequest_a, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

app.get('/auth', function(req, res) {
    res.sendFile(__dirname + '/views/add_to_slack.html')
})

app.get('/auth/redirect', (req, res) =>{
    var options = {
        uri: 'https://slack.com/oauth/authorize'
            +req.query.code+
            '&client_id='+process.env.CLIENT_ID+
            '&client_secret='+process.env.CLIENT_SECRET+
            '&redirect_uri='+process.env.REDIRECT_URI,
        method: 'GET'
    }
    request(options, (error, response, body) => {
        var JSONresponse = JSON.parse(body)
        if (!JSONresponse.ok){
            console.log(JSONresponse)
            res.send("Error encountered: \n"+JSON.stringify(JSONresponse)).status(200).end()
        }else{
            console.log(JSONresponse)
            res.send("Success!")
        }
    })
}) 