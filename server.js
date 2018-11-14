require('dotenv').config();

const express = require('express');
const apiUrl = 'https://slack.com/api';
const app = express();
const bodyParser = require('body-parser');

const rawBodyBuffer = (req, res, buf, encoding) => {
  if (buf && buf.length) {
    req.rawBody = buf.toString(encoding || 'utf8');
  }
};

app.use(bodyParser.urlencoded({verify: rawBodyBuffer, extended: true }));
app.use(bodyParser.json({ verify: rawBodyBuffer }));

app.get('/', (req, res) => {
  res.send('<h1>SnorriBot</h1><p>Snorri is hungry? Find out what he wants.</p><a href="https://slack.com/oauth/authorize?client_id=121504987699.463670568307&scope=commands,bot,incoming-webhook"><img alt="Add to Slack" height="40" width="139" src="https://platform.slack-edge.com/img/add_to_slack.png" srcset="https://platform.slack-edge.com/img/add_to_slack.png 1x, https://platform.slack-edge.com/img/add_to_slack@2x.png 2x" /></a>');
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
  else {
    const response = {text: '_stares at you_', response_type: "in_channel"};
    res.send(response)
  }
});

const server = app.listen(process.env.PORT || 5000, () => {
  console.log('Express server listening on port %d in %s mode', server.address().port, app.settings.env);
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
    req(options, (error, response, body) => {
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