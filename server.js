// server.js
const tinyspeck = require('tinyspeck');

const slack = tinyspeck.instance({
    token: process.env.SLACK_ACCESS_TOKEN
});

const yells = ['mreowww', 'wuoooahh', 'broo?', 'wooah', 'mwow?'];

const getYells = function () {
    return yells[Math.floor(Math.random() * yells.length)];
}

slack.on('/snorri', 'food', function (event) {
    const response_url = event.response_url;
    slack.send(response_url, {
        text: getYells()
    })
});

slack.on('sleepies', function (event) {
    const response_url = event.response_url;
    slack.send(response_url, {
        text: 'wowwwww'
    })
});

slack.on('message', message => {
  const response = messages.handleMessage(message.event.text);
  if (response) {
    slack.send({
      text: response,
      channel: message.event.channel
    })
  }
});

slack.on('*', event => { console.log(event) });

slack.listen(process.env.PORT, process.env.SLACK_ACCESS_TOKEN);