// server.js
//const tinyspeck = require('tinyspeck');
const { createEventAdapter } = require('@slack/events-api');
const slackEvents = createEventAdapter(process.env.SLACK_SIGNING_SECRET);
const port = process.env.PORT || 3000;

const express = require('express');
const request = require('request');
require('dotenv').config() 
var app = express();
//const slack = tinyspeck.instance({
//    token: process.env.SLACK_ACCESS_TOKEN
//});

const yells = ['mreowww', 'wuoooahh', 'broo?', 'wooah', 'mwow?'];

const getYells = function () {
    return yells[Math.floor(Math.random() * yells.length)];
}

slackEvents.on('/snorri', function (event) {
  if (event.text == 'food') {  
    const response_url = event.response_url;
    slackEvents.send(response_url, {
        response_type: "in_channel",
        text: getYells()
    })
  }
  else if (event.text == 'sleepies') {
    const response_url = event.response_url;
    slackEvents.send(response_url, {
        response_type: "in_channel",
        text: '_blinks_'
    })
  }
  else {
    const response_url = event.response_url;
    slackEvents.send(response_url, {
        response_type: "in_channel",
        text: '_stares at you_'
    })
  }
});

slackEvents.on('slash_command', event => { console.log(event) });

slackEvents.listen(process.env.PORT, process.env.SLACK_ACCESS_TOKEN);

// http.createServer(onRequest_a).listen(9011);

// function onRequest_a (req, res) {
//  res.write('Response from 9011\n');
//  res.end();
//}

// listen for requests :)
//var listener = app.listen(process.env.PORT, function () {
//  console.log('Your app is listening on port ' + listener.address().port);
//});

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