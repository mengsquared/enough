var express = require('express');
var app = express();
var routes = require('./routes');

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.get('/', routes.layout);
app.get('/add_new_number', routes.addNewNum);
app.get('/sendmsg', routes.sendmsg);
app.get('/insert', routes.insert);

var server = app.listen(2468, function(){
	console.log('Listening on port %d', server.address().port);
});