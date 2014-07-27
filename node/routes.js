var db_methods = require('./db_methods.js');
var Mailjet = require('./mailjet-sendemail');
console.log(Mailjet);
var mailjet = new Mailjet('6ea91449ef465acd2fb58ebf7f409874','632b28c43476eccc99f4f35253cea9d9');
var unirest = require('unirest');

var db_url = db_methods.getDBUrl();
var db_root = db_methods.establishConnection(db_url);

exports.article = function(req,res){
  var articles_ref = db_root.child("articles").child(req.params['postID']);
  articles_ref.on('value', function (snapshot) {
  	res.render('article', {
      postID: req.params['postID'],
      title: snapshot.val()['title'],
      description: snapshot.val()['description']
    });
  });
}

exports.articles = function(req, res){
  var articles_ref = db_root.child("articles")
  articles_ref.on('value', function (snapshot) {
    console.log(snapshot.val());
    res.render('articles', {
      title: 'Articles',
      articles: snapshot.val()
    });
  });
}

var mailer = function(user_obj, post){
  var articles_ref = db_root.child("articles").child(post);
  var post_data = {};
  articles_ref.on('value', function (snapshot) {
    post_data['title'] = snapshot.val()['title'];
    post_data['description'] = snapshot.val()['description'];
    post_data['link'] = snapshot.val()['url'];
    if (user_obj['member'] != 'Myself') {
      if (user_obj['number'] != ''){
        console.log(user_obj['number']);
        console.log("SEND TWILIO");
      }
      else if (user_obj['email'] != '') {
        console.log(user_obj['email']);
        e_mailer(user_obj['email'], post_data);
        console.log("SEND MAILJET");
      }
    }  
  }, function (errorObject) {
    console.log('The read failed: ' + errorObject.code);
  });
}

var e_mailer = function(dest, post) {
  var title = encodeURI(post['title']);
  console.log(title);
  var desc = post['description'];
  mailjet.sendText('me@raymondjacobson.com',
    dest, '"Enough Project: '+title.substr(0,30) +'..."', '"'+title +'\n'+'Read the whole story:\n'+post['link']+'"');
  // mailjet.sendText('me@raymondjacobson.com', 'jacobr2@rpi.edu', 'hi test', 'lol test');
}

exports.sendmsg = function(req,res){
  numbers = [];
  var ph = req.body['phoneNumber'];
  var post = req.body['postID'];
  var userRef = db_root.child("users").child(ph);
  userRef.on('value', function (snapshot) {
    for (var key in snapshot.val()) {
      mailer(snapshot.val()[key], post);
    }
  }, function (errorObject) {
    console.log('The read failed: ' + errorObject.code);
  });
	res.send('/ POST OK');
}

exports.insert = function(req, res){
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