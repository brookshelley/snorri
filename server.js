// server.js
const tinyspeck = require('tinyspeck');

const slack = tinyspeck.instance({
    token: process.env.BOT_TOKEN
});

const yells = ['mreowww', 'wuoooahh', 'broo?'];

const getYells = function () {
    return yells[Math.floor(Math.random() * yells.length)];
}

slack.on('/food', function (event) {
    const response_url = event.response_url;
    slack.send(response_url, {
        text: getYells()
    })
});

slack.on('*', event => { console.log(event) });

slack.listen(process.env.PORT, process.env.SLACK_ACCESS_TOKEN);