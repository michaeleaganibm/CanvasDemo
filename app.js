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
    console.log('CS: ' + consumerSecret);
    console.log('envelope: ' + encoded_envelope);

    var check = crypto.createHmac("sha256", consumerSecretApp).update(encoded_envelope).digest("base64");
    console.log('check: ' + check);

    if (check === consumerSecret) { 
        var envelope = JSON.parse(Buffer.from(encoded_envelope, "base64").toString("ascii"));
        //req.session.salesforce = envelope;
        //console.log("got the session object:");
        //console.log(envelope);
        console.log('JSON: ' + JSON.stringify(envelope));
        res.render('index', { title: envelope.context.user.userName, req : JSON.stringify(envelope) });
    }else{
        res.send("authentication failed");
    } 
})

app.listen(process.env.PORT, function () {
	console.log ("Server is listening!");
} );