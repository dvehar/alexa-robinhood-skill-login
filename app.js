var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var path = require('path');

var app = express();

app.use(express.static('public'));

var exphbs = require('express-handlebars');
app.engine('.hbs', exphbs({defaultLayout: 'default', extname: '.hbs'}));
app.set('view engine', '.hbs');

app.use(bodyParser());

app.get('/', function (req, res) {
  console.log('got a request:');
  console.log('  headers:');
  console.log(req.rawHeaders);
  console.log('  params:');
  console.log(req.params);
  console.log('  query:');
  console.log(req.query);
  console.log('  body:');
  console.log(req.body);

  res.render('index.hbs', { state: req.query.state, redirect_uri: req.query.redirect_uri });
});

app.use('/jquery', function (req, res, next) { res.sendFile(path.join(__dirname, 'node_modules/jquery/dist/jquery.min.js')); });

app.post('/login', function (req, res, next) {
  var username = req.body.username;
  var password = req.body.password;
  var state = req.body.state;
  var redirect_uri = req.body.redirect_uri;

  console.log('POST /login username(' + (username ? 'true' : 'false') + ') password(' + (password ? 'true' : 'false') + ')');
  request.post('https://api.robinhood.com/api-token-auth/', { form: { username: username, password: password } }, function (err, httpResponse, body) {
    if (err) {
      res.status(400);
      res.send('Unable to process request: ' + err);
    } else if (httpResponse && httpResponse.statusCode >= 400) {
      res.status(400);
      res.send('Unable to process request: ' + (body || ''));
    } else {
      console.log('Got a token');
      res.redirect(redirect_uri + '?state=' + state + '&access_token=' + body.token + '&token_type=Bearer');
    }
  });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

var port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Example app listening on port ' +  port);
});