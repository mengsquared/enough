var db_methods = require('./db_methods.js');

exports.article = function(req,res){
	res.render('article', {
    postID: req.params['postID'],
    title: 'Some article about Lorem Ipsum Dolor...',
    description: '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi at lectus consequat, venenatis sem vitae, vulputate urna. Nullam sit amet lectus diam. Integer convallis odio id orci bibendum, ut semper dui molestie. Donec ultrices ligula leo, a condimentum urna feugiat eu. Nam pharetra odio eget elit porta, quis scelerisque augue ultrices. Maecenas ullamcorper sed tellus iaculis convallis. Etiam vitae venenatis purus, eget gravida enim. Ut dui arcu, accumsan eu semper porttitor, fringilla ut lectus. Nulla ullamcorper consequat aliquet. Aliquam sollicitudin arcu ac felis dictum semper. Aliquam non magna in mi molestie dapibus vitae vitae quam. Aenean ac diam non elit eleifend consequat ut ac ante. Sed et ullamcorper urna, ut scelerisque nibh. Nunc tempus, urna hendrerit lobortis sagittis, lacus odio vulputate velit, at porttitor turpis massa id nunc.</p><p>Nunc egestas ante eget nisi ultrices luctus a pellentesque purus. Fusce sit amet urna sit amet enim viverra vehicula. Cras erat nisi, convallis sed pharetra luctus, porta vel purus. Quisque quis lacus eu tortor laoreet imperdiet. Mauris suscipit ante sit amet urna sagittis consequat. Suspendisse bibendum elit in iaculis ultrices. Etiam eu lobortis mi. Proin sed eros enim. Cras mollis semper neque id molestie. Nulla ac dignissim est. Suspendisse potenti. Praesent non neque luctus, gravida eros quis, eleifend magna. Donec sit amet molestie risus. Curabitur venenatis bibendum nunc vel tempus.</p>'
  })
}

exports.articles = function(req, res){
  res.render('articles', {
    title: 'Articles'
  })
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