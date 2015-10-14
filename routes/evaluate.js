var express = require('express');
var router = express.Router();
var fs = require('fs');

var exec = require('child_process').exec;

/*
 * This bit of code takes in the evaluations done by the user's teacher and
 * adds it in the database in JSON form I'm struggling to specify.
 *
 */ 

router.post('/', function(req, res, next) {

    if (req.user.role != 'teacher') {
	res.json({msg: 'No privileges for posting evaluations'});
    }
    else {
	var evaluee=req.body.eval_user;
	var score = req.body.score;
	var evaltype = req.body.evaltype;
	var taskid = ""+req.body.task;

	var evaluator= req.user.username;

	console.log('Evaluee: '+evaluee);

	var db = req.db;    
        var collection = db.get('userlist');

	collection.findOne({username: evaluee}, function(err, userdata) {
	    if (!err) {
		console.log("userdata.evaluations["+taskid+"]["+evaltype+"]");	    
		console.log(userdata.evaluations[taskid][evaltype]);
		
		userdata.evaluations[taskid][evaltype][evaluator]={'score' : score, 'evaluated_by':evaluator };
		
		collection.update({ "username": evaluee  }, { $set : { evaluations : userdata.evaluations  }},  function(e,success){
		    if (!e) {
			res.json({msg: ''});
		    }
		    else {
			res.json({msg: 'Error: '+e.err});
		    }
		});
	    }
	    else {
		res.json({msg: 'Error: '+err.err});		
	    }
	});
    }
});


module.exports = router;
