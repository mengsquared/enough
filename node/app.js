var express = require('express');
var app = express();
var routes = require('./routes');
var db_methods = require('./db_methods.js');

app.use(express.bodyParser());

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.get('/', routes.layout);
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