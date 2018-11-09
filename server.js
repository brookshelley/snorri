// server.js
const tinyspeck = require('tinyspeck');
var text='';

const slack = tinyspeck.instance({
    token: process.env.SLACK_ACCESS_TOKEN
});

const yells = ['mreowww', 'wuoooahh', 'broo?', 'wooah', 'mwow?'];

const getYells = function () {
    return yells[Math.floor(Math.random() * yells.length)];
}

slack.on('/snorri', function (event) {
    const response_url = event.response_url;
    slack.send(response_url, {
        text: getYells()
    })
});

slack.on('/snorri', message => {'food'}, function (event) {
    const response_url = event.response_url;
    slack.send(response_url, {
        text: 'nope'
    })
});

slack.on('*', event => { console.log(event) });

slack.listen(process.env.PORT, process.env.SLACK_ACCESS_TOKEN);