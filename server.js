// server.js
const tinyspeck = require('tinyspeck');
const express = require('express');
const request = require('request');

const app = express();

const slack = tinyspeck.instance({
    token: process.env.SLACK_ACCESS_TOKEN
});

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

app.get('/auth', (req, res) =>{
    res.sendFile(__dirname + '/add_to_slack.html')
})

app.get('/auth/redirect', (req, res) =>{
    var options = {
        uri: 'https://slack.com/api/oauth.access?code='
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