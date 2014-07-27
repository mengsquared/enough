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

exports.pollBlogs = function() {
  setInterval(function(){
    
  console.log('FIRED');
  var client = require('twilio')('ACec64a5b0feb7121fd6a33718d1fc4390', '0a4ecac03a0cb832a0cbfd221c329b20');
  var xml2js = require('xml2js');
  var string = "http://www.enoughproject.org/blog/feed";
  var extractedData = "";
  var parser = new xml2js.Parser();


  }, 1000);
}