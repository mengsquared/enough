var express = require('express')
  , stylus = require('stylus')
  , fs = require('fs')
  , nib = require('nib')
var app = express();
var routes = require('./routes');
var db_methods = require('./db_methods.js');


function compile(str, path) {
  return stylus(str)
    .set('filename', path)
    .use(nib());
}

app.use(express.bodyParser());

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.logger('dev'));
app.use(stylus.middleware(
  { src: __dirname + '/assets'
  , compile: compile
  }
));
app.use(express.static(__dirname + '/assets'))

app.get('/a/:postID', routes.article);
app.get('/a/', routes.articles);
app.post('/sendmsg', routes.sendmsg);
app.post('/insert', routes.insert);
app.post('/add_phone', routes.add_phone);
//app.get('/twilio', routes.twilio);

app.post('/testpost', routes.testpost);
app.get('/testget', routes.testget);
var server = app.listen(2468, function(){
  db_methods.pollBlogs();
	console.log('Listening on port %d', server.address().port);
});