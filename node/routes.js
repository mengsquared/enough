var db_methods = require('./db_methods.js');

exports.layout = function(req,res){
	res.send('home page');
}

exports.addNewNum = function(req,res){
	res.send('add number');
}

exports.sendmsg = function(req,res){
	res.render('sendmsg', {
		title: 'sendmsg'
	});
}

exports.insert = function(req, res){
  console.log('ins');

  db_url = db_methods.getDBUrl();
  db_root = db_methods.establishConnection(db_url);
  insert_data = {
  	'senderNum' : "248-888-8888",
  	'memberNum': "248-880-0325"
  }
  db_methods.insertTransaction(db_root, insert_data[senderNum], insert_data[memberNum]);

  res.send('/ POST OK');
}