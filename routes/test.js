var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    // Respond with the basic test template:
    res.render('tests', { title: 'Testing!', 
			  user: req.user.username , 
			  ui_language: req.ui_language,
			  error_message: req.flash('error'), 
			  success_message: req.flash('error') 
			});

});


router.get('/user/:user/task/:task/trial/:trial', function(req, res, next) {

    // Send task and trial information for the user:

    console.log("Serving test for req.params.user "+ req.params.user.value );

    var db = req.db;    
    var collection = db.get('userlist');

    var showinstructions = (req.params.trial < 1);
/*
    if  (req.user.username != req.params.user.value) {
	res.json({
	    "stimulus_layout" : "<h2>Et ole kirjautunut enää järjestelmään!<H2><p>Mene kirjautumissivulle ja kokeile uudestaan</p>",
	    "controls" : "None",
	    "showinstructions" : 0,
	    "trial": {
		"response_time" : 100,
		"stimulus" : "",
	    }
	});
    }
  */  
    collection.findOne({ "username" : req.user.username },{},function(e,test){

	// extract the task arrays for this particular user:
	var usertask=test['tasks'][req.params.task];
	var usertrial=test['trials'][req.params.task][req.params.trial];

	console.log("Finding task " + usertask + " trial " +usertrial + " for user " + req.user.username );

	// Check what is the next task/trial for this user:
	var next;

	console.log("Define next task:");
	if ([req.params.task]<test['tasks'].length-1) {
	    // If there is another trial for this task, choose that one:
	    if (typeof (test['trials'][req.params.task][parseInt(req.params.trial)+1]) !== 'undefined') {
		next="/test/user/"+req.user.username+"/task/"+req.params.task+"/trial/"+(parseInt(req.params.trial) +1);
	    }
  	    // If not, then go to trial 0 of the next task:
	    else {
		next="/test/user/"+req.user.username+"/task/"+ ( parseInt(req.params.task) + 1 )+"/trial/0";
	    }
	}
	else
	{
	    next="/test/user/"+req.user.username+"/task/0/trial/0";
	}

	console.log("Next task is: "+next);

	console.log("Get the task collection and do stuff");

	// Use these collection variables to make the code slightly easier to read;
	// and nest functions because I believe at the moment that it is the right thing to do...
	taskcollection = db.get('tasks');

	// Get the task description from database:
	taskcollection.findOne( { "task_id" : usertask }, {}, function(e,task) {
	   	    
	    console.log("Found task");
	    

	    // Get the trial description from the database:
	    trialcollection = db.get('trials');
	    trialcollection.findOne({ "task_id" : usertask, "trial_id" : usertrial },{},function(e,trial){
		
		console.log("Found trial");


		task.trial=trial;
		task.next= next;

		task.showinstructions = showinstructions;

		// Return the description in JSON form; Is this a good idea? Hopefully.
		// We do aim to have a single web page that will be refreshed with javascript.
		res.json(task);
	    });				 
	});    
    });
    

});




module.exports = router;
