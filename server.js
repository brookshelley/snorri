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

slack.on('/snorri', function (event) {
  if (event.text == 'food') {  
    const response_url = event.response_url;
    slack.send(response_url, {
        text: getYells()
    })
  }
  else if (event.text == '
    
  )
  else {
    const response_url = event.response_url;
    slack.send(response_url, {
        text: '_stares at you_'
    })
  }
});

slack.on('*', event => { console.log(event) });

slack.listen(process.env.PORT, process.env.SLACK_ACCESS_TOKEN);