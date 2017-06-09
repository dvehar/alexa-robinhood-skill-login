var express = require('express');

var app = express();

app.use(express.static('public'));

var exphbs = require('express-handlebars');
app.engine('.hbs', exphbs({defaultLayout: 'default', extname: '.hbs'}));
app.set('view engine', '.hbs');

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
  
  // console.log(res);
  res.render('index.hbs', { });
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