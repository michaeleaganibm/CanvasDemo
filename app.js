var express = require('express'),
bodyParser = require('body-parser'),
path = require('path') 
var app = express();
var crypto = require("crypto");
const { encode } = require('punycode');
var consumerSecretApp = process.env.CANVAS_CONSUMER_SECRET;

app.use(express.static(path.join(__dirname, 'views')));
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
 
app.get('/', function (req, res) {
  res.render('hello');
});

app.post('/', function (req, res) { 
  var bodyArray = req.body.signed_request.split(".");
    var consumerSecret = bodyArray[0];
    var encoded_envelope = bodyArray[1];
    
    var check = crypto.createHmac("sha256", consumerSecretApp).update(encoded_envelope).digest("base64");
    if (check === consumerSecret) { 
        var envelope = JSON.parse(Buffer.from(encoded_envelope, "base64").toString("ascii"));
        //res.header('X-Frame-Options', 'SAMEORIGIN');
        res.header('Content-Security-Policy', 'frame-ancestors \'self\' https://heroku.com');
        res.render('index', { title: envelope.context.user.userName, req : JSON.stringify(envelope) });
    } else {
        //res.header('X-Frame-Options', 'SAMEORIGIN');
        res.header('Content-Security-Policy', 'frame-ancestors \'self\' https://heroku.com');
        res.send("authentication failed");
    } 
})

app.listen (process.env.PORT, function () {
  console.log ("Server is listening!");
} );