// server.js
const tinyspeck = require('tinyspeck');

const slack = tinyspeck.instance({
    token: process.env.BOT_TOKEN
});  

const greetings = ['Hello!', 'Hi there!', 'Bonjour!',
    'Saluton!', '여보세요', '¡Hola!'];

const getGreeting = function () {
    return greetings[Math.floor(Math.random() * greetings.length)];
}

slack.on('/hello', function (event) {
    const response_url = event.response_url;
    slack.send(response_url, {
        text: getGreeting()
    })
});

slack.on('*', event => { console.log(event) });

slack.listen(process.env.PORT, process.env.VERIFICATION_TOKEN);