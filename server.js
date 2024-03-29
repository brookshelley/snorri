require('dotenv').config();
var express = require('express');
const apiUrl = 'https://slack.com/api';
var app = express();
const bodyParser = require('body-parser');
var request = require('request');
var clientId = process.env.CLIENT_ID;
var clientSecret = process.env.CLIENT_SECRET;
const axios = require('axios'); 
const qs = require('querystring');
//var token = process.env.BOT_TOKEN;
const SlackClient = require('@slack/client').WebClient;
const slackEventsApi = require('@slack/events-api');
const slackEvents = slackEventsApi.createEventAdapter(process.env.SLACK_SIGNING_SECRET);
const slack = new SlackClient(process.env.SLACK_ACCESS_TOKEN);
app.use('/slack/events', slackEvents.expressMiddleware());

const rawBodyBuffer = (req, res, buf, encoding) => {
  if (buf && buf.length) {
    req.rawBody = buf.toString(encoding || 'utf8');
  }
};

app.use(bodyParser.urlencoded({verify: rawBodyBuffer, extended: true }));
app.use(bodyParser.json({ verify: rawBodyBuffer }));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html')
});

slackEvents.on('link_shared', (event) => {
  console.log(event);
  slack.chat.unfurl({ 
    token: process.env.SLACK_USER_TOKEN, 
    channel: event.channel, 
    ts: event.message_ts, 
    user_auth_required: false,
    unfurls: {
      "https://www.brookshelley.com": {
          //"text": "Every day is the test.",
          //blocks: [
            //{
              //"type": "image",
              //"title": {
                //"type": "plain_text",
                //"text": "Please enjoy this photo of a kitten"
            //},
              //"block_id": "image4",
             // "image_url": "http://placekitten.com/500/500",
              //"alt_text": "An incredibly cute kitten."
            //}  
        //]  
          "attachments": [
            {
            "fallback": "Required plain-text summary of the attachment.",
            "color": "#2eb886",
            "pretext": "Optional text that appears above the attachment block",
            "author_name": "Bobby Tables",
            "author_link": "http://flickr.com/bobby/",
            "author_icon": "http://flickr.com/icons/bobby.jpg",
            "title": "Slack API Documentation",
            "title_link": "https://api.slack.com/",
            "text": "Optional text that appears within the attachment",
            "fields": [
                {
                    "title": "Priority",
                    "value": "High",
                    "short": false
                }
            ],
            "image_url": "http://my-website.com/path/to/image.jpg",
            "thumb_url": "http://example.com/path/to/thumb.png",
            "footer": "Slack API",
            "footer_icon": "https://platform.slack-edge.com/img/default_application_icon.png",
        }
      ]
      }
    } 
  })
    .then((res) => {
    console.log('Unfurled: ', res.ts);
    //console.log(res);
  })
  .catch(console.error);
});

const yells = ['mreowww', 'wuoooahh', 'broo?', 'wooah', 'mwow?', 'wonnnn', 'brrowww', 'moww'];

const getYells = function () {
    return yells[Math.floor(Math.random() * yells.length)];
}

const laterGator2 = async(channel, text) => { 
  const args = {
    token: process.env.BOT_TOKEN,
    channel: 'DE1CEDCSK',
    text: 'hello from the past',
    post_at: "1546898820",
  };
  
  const result = await axios.post('https://slack.com/api/chat.scheduleMessage', qs.stringify(args));
  
  try {
    console.log(result.data);
  } catch(e) {
    console.log(e);
  }
};

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
        },
        {
		  "type": "section",
		  "text": {
			  "type": "mrkdwn",
			  "text": "*Check out* _this text_. It's hella fresh"
		      }
        }
      ]
    }
    res.send(response)
  }
  else if (req.body.text == 'choices') {
    var channel = req.body.channel_id;
    var responseURL = req.body.response_url;
    const response = {
      channel: channel,
      blocks: [
       {
         "type": "actions",
         "elements": [
           {
             "type": "button",
             "text": {
               "type": "plain_text",
               "text": "Meow"
             },
           "value": "click_me_1",
				   "action_id": "button1"
           },
           { 
             "type": "button",
             "text": {
               "type": "plain_text",
               "text": "Moooo"
             },
           "value": "click_me_2",
				   "action_id": "button2"
           }
          ]
        }
      ]
     }
     res.send (response);
   }
  else if (req.body.text == 'later') {
    var channel = req.body.channel_id;
    const response = {
      channel: channel,
      text: 'your message is scheduled',
    }
    res.send(response),
    laterGator2(req)
  }
  else {
    const response = {text: '_stares at you_', response_type: "in_channel"};
    res.send(response)
  }
});

function sendMessageToSlackResponseURL(responseURL, JSONmessage){
    var postOptions = {
        uri: responseURL,
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        json: JSONmessage
    }
    request(postOptions, (error, response, body) => {
        if (error){
            // handle errors as you see fit
        }
    })
}

app.post('/interactive', (req, res) =>{
    res.status(200).end() // best practice to respond with 200 status
    console.log (req.body.payload);
    var actionJSONPayload = JSON.parse(req.body.payload) // parse URL-encoded payload JSON string
    console.log (actionJSONPayload);
    var message = {
        "text": actionJSONPayload.user.username + " did it",
        "replace_original": true
    }
    sendMessageToSlackResponseURL(actionJSONPayload.response_url, message)
})

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