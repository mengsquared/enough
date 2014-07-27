var db_methods = require('./db_methods.js');

exports.layout = function(req,res){
	res.send('home page');
}

var mailer = function(user_obj){ 
  // if(user_obj)
  if (user_obj['member'] != 'Myself') {
    if (user_obj['number'] != ''){
      console.log(user_obj['number']);
      console.log("SEND TWILIO");
    }
    else if (user_obj['email'] != '') {
      console.log(user_obj['email']);
      console.log("SEND MAILJET");
    }
  }
}

exports.sendmsg = function(req,res){
  db_url = db_methods.getDBUrl();
  db_root = db_methods.establishConnection(db_url);
  numbers = [];
  var ph = req.body['phoneNumber'];
  var post = req.body['postID'];
  var userRef = db_root.child("users").child(ph);
  userRef.on('value', function (snapshot) {
    for (var key in snapshot.val()) {
      mailer(snapshot.val()[key]);
    }
  }, function (errorObject) {
    console.log('The read failed: ' + errorObject.code);
  });
	res.send('/ POST OK');
}

exports.insert = function(req, res){
	db_url = db_methods.getDBUrl();
	db_root = db_methods.establishConnection(db_url);
  console.log(req.body);
	var userRef = db_root.child("users").child(req.body['pilotPhoneNumber']);
  var newNumber = (req.body['mobileNumber']).replace('(','').replace(')','').replace('-','').replace(/\s/g, "");
  var email = '';
  if (req.body['homeEmail'].length != 0){
    var email = req.body['homeEmail']
  }
	userRef.push({
  	member: req.body['firstName'] + ' ' + req.body['lastName'],
  	number: newNumber,
    email: email
	});

  res.send('/ POST OK');
}

exports.add_phone = function(req, res){
  db_url = db_methods.getDBUrl();
  db_root = db_methods.establishConnection(db_url);
  var userRef = db_root.child("users").child(req.body['phoneNumber']);
  userRef.push({
    member: 'Myself',
    number: req.body['phoneNumber']
  });
  console.log(req.body['phoneNumber']);
  res.send('/ POST OK');
}

exports.testpost = function(req, res){
  console.log(req.body);
  res.send('/ POST OK');
}
exports.testget = function(req, res){
  console.log(req.query);
  res.send('/ GET OK');
}

// exports.twilio = function(req,res){
// 	var client = require('twilio')('ACec64a5b0feb7121fd6a33718d1fc4390', '0a4ecac03a0cb832a0cbfd221c329b20');
// 	//var parseString = require('xml2js').parseString;
// 	//var xml = "<title>";
// 	//parseString(xml, function(err, result){
// 	//	console.log(result);
// 	//});
// 	client.sendMessage({
// 		to: '+2488800325',
// 		from: '+19513833688',
// 		body: "hi"
// 	}, function(err, responseData) { //this function is executed when a response is received from Twilio

//     if (!err) { // "err" is an error received during the request, if any

//         // "responseData" is a JavaScript object containing data received from Twilio.
//         // A sample response from sending an SMS message is here (click "JSON" to see how the data appears in JavaScript):
//         // http://www.twilio.com/docs/api/rest/sending-sms#example-1

//         console.log(responseData.from); // outputs "+14506667788"
//         console.log(responseData.body); // outputs "word to your mother."

//     }

// });
// // }

// var twil_helper = function(from, item, current_location){
// 	response_location = location_methods.get_locations();
// }