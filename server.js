require('dotenv').config();
var express = require('express');
const apiUrl = 'https://slack.com/api';
var app = express();
const bodyParser = require('body-parser');
var request = require('request');
var clientId = process.env.CLIENT_ID;
var clientSecret = process.env.CLIENT_SECRET;

const rawBodyBuffer = (req, res, buf, encoding) => {
  if (buf && buf.length) {
    req.rawBody = buf.toString(encoding || 'utf8');
  }
};

app.use(bodyParser.urlencoded({verify: rawBodyBuffer, extended: true }));
app.use(bodyParser.json({ verify: rawBodyBuffer }));

app.get('/', (req, res) => {
//  res.send('<h1>SnorriBot</h1><p>Snorri is hungry? Find out what he wants.</p><a href="https://slack.com/oauth/authorize?client_id=121504987699.463670568307&scope=commands,bot,incoming-webhook"><img alt="Add to Slack" height="40" width="139" src="https://platform.slack-edge.com/img/add_to_slack.png" srcset="https://platform.slack-edge.com/img/add_to_slack.png 1x, https://platform.slack-edge.com/img/add_to_slack@2x.png 2x" /></a>');
    res.sendFile(__dirname + '/views/index.html')
});

const yells = ['mreowww', 'wuoooahh', 'broo?', 'wooah', 'mwow?', 'wonnnn', 'brrowww', 'moww'];

const getYells = function () {
    return yells[Math.floor(Math.random() * yells.length)];
}

app.post('/snorri', (req, res) => {
  console.log(req.body);
  if (req.body.text == 'food') {  
    const response = {text: getYells(), response_type: "in_channel"};
    res.send(response)
  }
  else if (req.body.text == 'sleepies') {
    const response = {text: '_blinks_', response_type: "in_channel"};
    res.send(response)
  }
  else if (req.body.text == 'blocks') {
    var channel = req.body.channel_id;
    console.log(channel);
    const response = {
      channel: channel,
      blocks: [
        {
        "type": "image",
        "title": {
          "type": "plaintext",
          "text": "Please enjoy this photo of a kitten"
          },
        "block_id": "image4",
        "image_url": "http://placekitten.com/500/500",
        "alt_text": "An incredibly cute kitten."
        }
      ]
    }
    res.send(response)
  }
  else {
    const response = {text: '_stares at you_', response_type: "in_channel"};
    res.send(response)
  }
});

const server = app.listen(process.env.PORT || 5000, () => {
  console.log('Express server listening on port %d in %s mode', server.address().port, app.settings.env);
});

app.get('/auth', (req, res) =>{
    res.sendFile(__dirname + '/views/add_to_slack.html')
})

app.get('/oauth', function(req, res) {
    // When a user authorizes an app, a code query parameter is passed on the oAuth endpoint. If that code is not there, we respond with an error message
    if (!req.query.code) {
        res.status(500);
        res.send({"Error": "Looks like we're not getting code."});
        console.log("Looks like we're not getting code.");
    } else {
        // If it's there...

        // We'll do a GET call to Slack's `oauth.access` endpoint, passing our app's client ID, client secret, and the code we just got as query parameters.
        request({
            url: 'https://slack.com/api/oauth.access', //URL to hit
            qs: {code: req.query.code, client_id: clientId, client_secret: clientSecret}, //Query string data
            method: 'GET', //Specify the method
        })
    }
})