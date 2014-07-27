var Firebase = require('firebase');

exports.getDBUrl = function() {
  db = "https://enough-ios-test.firebaseio.com/";
  return db;
}

exports.establishConnection = function(db){

  var rootRef = new Firebase(db);
  return rootRef;
};

exports.pollBlogs = function() {
  setInterval(function(){
    console.log("POLL");
  }, 10000);
}