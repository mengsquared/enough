var Firebase = require('firebase');

exports.getDBUrl = function() {
  db = "https://justenough.firebaseio.com/";
  return db;
}

exports.establishConnection = function(db){

  var rootRef = new Firebase(db);
  return rootRef;
};