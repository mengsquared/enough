var Firebase = require('firebase');
var Chance = require('chance');
var chance = new Chance();
var pool = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

exports.getDBUrl = function() {
  db = "https://enough-ios-test.firebaseio.com/";
  return db;
}
var getDBUrl = function() {
  db = "https://enough-ios-test.firebaseio.com/";
  return db;
}

exports.establishConnection = function(db){
  var rootRef = new Firebase(db);
  return rootRef;
};
var establishConnection = function(db){
  var rootRef = new Firebase(db);
  return rootRef;
};
var db_url = getDBUrl();
var db_root = establishConnection(db_url);

var asyncLoop = function(o){
    var i=-1,
        length = o.length;
    
    var loop = function(){
        i++;
        if(i==length){o.callback(); return;}
        o.functionToLoop(loop, i);
    } 
    loop();//init
}
pollBlogsCB = function(new_articles){

  // var userRef = db_root.child("users");
  // userRef.on('value', function (snapshot) {
  //   var key = Object.keys(snapshot.val())[0];
  //   for (var key in snapshot.val()) {
  //     // console.log(new_articles[article]['title'].substr(0,30) + "-via Enough Project"
  //         // + ' http://51eb0b2a.ngrok.com/a/' + new_articles[article]['randKey']);
  //     // console.log(key);
  //     // client.sendSms({
  //     //   to: '+1'+key,
  //     //   from: '+19513833688',
  //     //   body: new_articles[article]['title'].substr(0,30) + "-via Enough Project"
  //     //     + ' http://51eb0b2a.ngrok.com/a/' + randKey
  //     // }, function(err, responseData){
  //     //     if (!err) {
  //     //       console.log(responseData.body);
  //     //     }?
  //     // });
  //     break;
  //   }
  // });

  // console.log(new_articles);
  var articlesRef = db_root.child("articles");
  for(var article in new_articles){
    // console.log(new_articles[article]['randKey']);
    var articleRef = articlesRef.child(new_articles[article]['randKey']);
    articleRef.transaction(function(value){
      if(value===null){
        articlesRef.child(new_articles[article]['randKey']).set({
          url: new_articles[article]['link'],
          description: new_articles[article]['desc'],
          title: new_articles[article]['title']
        });
      }
    });
  }
}

exports.pollBlogs = function() {
  setInterval(function(){
    console.log('FIRED');
    // DECLARATIONS
    var client = require('twilio')('ACec64a5b0feb7121fd6a33718d1fc4390', '0a4ecac03a0cb832a0cbfd221c329b20');
    var xml2js = require('xml2js');
    var string = "http://www.enoughproject.org/blog/feed";
    var extractedData = "";
    var parser = new xml2js.Parser();
    var request = require('request');
    request(string, function(error, response, body){
      if (!error && response.statusCode == 200) {
        parser.parseString(body, function(err, result) {
          var records = result['rss']['channel'][0]['item'];
          var numItems = records.length;
          var articlesRef = db_root.child("articles");
          var new_articles = [];
          for (var record in records){
            var article = {}
            var link = records[record]['link'][0];
            var title = records[record]['title'][0];
            var desc = records[record]['description'][0]; 
            var p = title.charCodeAt(0) % (pool.length - 1);
            var j = title.charCodeAt(Math.floor(title.length/2)) % (pool.length -1);
            var k = title.charCodeAt(title.length-1) % (pool.length -1);
            var randKey = [pool[p], pool[j], pool[k]].join('');
            article['link'] = link;
            article['title'] = title;
            article['desc'] = desc;
            article['randKey'] = randKey;
            // console.log(randKey);
            new_articles.push(article);
            if (new_articles.length == numItems){
              pollBlogsCB(new_articles); 
            }
          }
        });
      }
    });
  }, 5000);
}