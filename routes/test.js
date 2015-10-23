var express = require('express');
var router = express.Router();



/* GET home page. */
router.get('/', function(req, res, next) {

    
    if (req.user.role == 'user') {
	// Respond with the basic test template:
	res.render('tests', { title: 'Testing!', 
			      user: req.user , 
			      base_url: req.base_url,
			      ui_language: req.ui_language,
			      error_message: req.flash('error'), 
			      success_message: req.flash('error') 
			    });
    }
    else {
	// Respond with the test view/edit template:
	res.redirect(req.base_url+'/tasks');	
    }
    
});


router.get('/user/:user/task/:task/trial/:trial', function(req, res, next) {


    // Send task and trial information for the user:

    console.log("Serving test for req.params.user "+ req.params.user );

    var db = req.db;    
    var collection = db.get('userlist');

    var showinstructions = (req.params.trial < 1);

    collection.findOne({ "username" : req.user.username },{},function(e,usertest){

	// extract the task arrays for this particular user:
	var usertask=usertest['tasks'][req.params.task];
	var usertrial=usertest['trials'][req.params.task][req.params.trial];

        var donetrials=usertest['testsdone'];

	console.log("Finding task " + usertask + " trial " +usertrial + " for user " + req.user.username );

	// Check what is the next task/trial for this user:
	var next;

	console.log("Define next task: (req.params.trial == "+req.params.trial+")");        
        
        nexttask=req.params.task;
        nexttrial=req.params.trial;

	
        do {
	    // If this is not the last task:
	    if ([nexttask]<usertest['tasks'].length-1) {
	        // If there is another trial for this task, choose that one:
	        if (typeof (usertest['trials'][nexttask][parseInt(nexttrial)+1]) !== 'undefined') {

                    console.log("Before update: "+nexttask+","+nexttrial);
                    nexttrial = 1+parseInt(nexttrial);

                    console.log("Next trial: "+nexttask+","+nexttrial);

	        }
  	        // If not, then go to trial 0 of the next task:
	        else {

		    console.log("typeof (usertest['trials']["+nexttask+"]["+(parseInt(nexttrial)+1)+"]) : " +typeof (usertest['trials'][nexttask][nexttrial+1]) );

                    nexttask=parseInt(nexttask)+1 ;
                    nexttrial = 0;
                    console.log("Next task: "+nexttask+","+nexttrial);

	        }
	    }
            else
            {
                nexttask=0;
                nexttrial=0;
                break;
            }
            console.log('Test done? usertest.testsdone[ '+
			usertest['tasks'][nexttask]+
			' ][ '+ 
			usertest['trials'][nexttrial] +
			' ] (= '+nexttask+','+nexttrial+': ');
	    console.log(usertest.testsdone[ nexttask ][  nexttrial ] );
        } while ( usertest.testsdone[ nexttask ][  nexttrial ] );



        console.log("Next: "+nexttask+", "+nexttrial);

        next=req.base_url+"/test/user/"+req.user.username+"/task/"+nexttask+"/trial/"+nexttrial;

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
