// server.js
const tinyspeck = require('tinyspeck');
const express = require('express');
const request = require('request');
require('dotenv').config();
const dispatcher = require('httpdispatcher');
const http = require('http');
const EventEmitter = require('events');
const app = express();
const slack = tinyspeck.instance({
    token: process.env.SLACK_ACCESS_TOKEN
});

class TinySpeck extends EventEmitter {
  /**
   * Contructor
   *
   * @param {Object} defaults - The default config for the instance
   */
  constructor(defaults) {
    super();
    this.cache = {};

    // message defaults
    this.defaults = defaults || {};
    
    // loggers
    this.on('error', console.error);
  }


  /**
   * Create an instance of the TinySpeck adapter
   *
   * @param {Object} defaults - The default config for the instance
   * @return {TinySpeck} A new instance of the TinySpeck adapter
   */
  instance(defaults) {
    return new this.constructor(defaults);
  }
}

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

slack.listen(port, token) {
// Display the Add to Slack button
    dispatcher.onGet("/", function(req, res) {
      res.writeHead(200, {'Content-Type': 'text/html'});
      let html = '<h1>Example Onboarding Slack Bot</h1><p>This project demonstrates how to build a Slack bot using Slack\'s Events API.</p><p>To test it out:</p><a id="add-to-slack" href="'+add_to_slack+'"><img alt="Add to Slack" height="40" width="139" src="https://platform.slack-edge.com/img/add_to_slack.png" srcset="https://platform.slack-edge.com/img/add_to_slack.png 1x, https://platform.slack-edge.com/img/add_to_slack@2x.png 2x" /></a><script src="https://button.glitch.me/button.js" data-style="glitch"></script><div class="glitchButton" style="position:fixed;top:20px;right:20px;"></div>';
      res.end(html);
    });     

    return http.createServer((req, res) => {
      let data = '';
      
      req.on('data', chunk => data += chunk);
      
      req.on('end', () => {
        let message = this.parse(data);

        // notify upon request
        this.emit(req.url, message); 

        // new subscription challenge
        if (message.challenge){ console.log("verifying event subscription!"); res.end(message.challenge); return exit(); }
        
        // digest the incoming message
        if (!token || token === message.token) this.digest(message);
        
        // close response
        res.end();
      });
      
      dispatcher.dispatch(req, res);
    });
};

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