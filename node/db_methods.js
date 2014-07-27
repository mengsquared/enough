var Firebase = require('firebase');

exports.getDBUrl = function() {
  db = "https://justenough.firebaseio.com/";
  return db;
}

exports.establishConnection = function(db){

  var rootRef = new Firebase(db);
  return rootRef;
};

exports.insertTransaction = function(rootRef, sender, member){
	var transactionsRef = rootRef.child(sender);
	transactionsRef.set(member);
}