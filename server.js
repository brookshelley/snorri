// server.js
const tinyspeck = require('tinyspeck');
const express = require('express');

const app = express();

const slack = tinyspeck.instance({
    token: process.env.SLACK_ACCESS_TOKEN
});

const yells = ['mreowww', 'wuoooahh', 'broo?', 'wooah', 'mwow?'];

const getYells = function () {
    return yells[Math.floor(Math.random() * yells.length)];
}

slack.on('/snorri', message => {}, function (event) {
    const response_url = event.response_url;
    slack.send(response_url, {
        funct
    })
});

app.post('/command', (req, res) => {
  // extract the slash command text, and trigger ID from payload
  const { text } = req.body;
  
  if (req.body=='food') {
  const response_url = event.response_url;
  slack.send(response_url, {
        text: 'yes, please'
    })
  }
});

slack.on('*', event => { console.log(event) });

slack.listen(process.env.PORT, process.env.SLACK_ACCESS_TOKEN);