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

	// Use these collection variables to make the code slightly easier to read;
	// and nest functions because I believe at the moment that it is the right thing to do...
	taskcollection = db.get('tasks');

	// Get the task descriptions from database:
	taskcollection.find( { "task_id" : { $in: usertest.tasks}}, {}, function(e,all_tasks) {
	    
	    console.log("Found tasks ");
	    	    
	    // Get the trial description from the database:
	    trialcollection = db.get('trials');
	    trialcollection.find({ "task_id" : { $in: usertest.tasks}},{},function(e,all_trials){
		
		console.log("Found trials (lots of them? "+all_trials.length+")");
		
		// extract the task arrays for this particular user:
		var usertask=usertest['tasks'][req.params.task];
		var usertrial=usertest['trials'][req.params.task][req.params.trial];

		var donetrials=usertest['testsdone'];

		console.log("Finding task " + usertask + " trial " +usertrial + " for user " + req.user.username );

		// Check what is the next task/trial for this user:
		var next;

		console.log("Define next task: (req.params.task  == "+req.params.task+")");        
		console.log("       and trial: (req.params.trial == "+req.params.trial+")");        
		
		nexttask=req.params.task;
		nexttrial=req.params.trial;

		next_triggers=false;
		all_tests=[];
		resp_time=0;
		total_length=0;

		usertest.tasks.forEach(function(task_item, task_index) {
		    console.log(task_index+ "\t "+task_item);
		    usertest.trials[task_index].forEach(function(trial_item, trial_index) {
			console.log('   '+trial_index +"\t   " + trial_item);
			if (  task_index== req.params.task && trial_index == req.params.trial ) {
			    style="now";
			    // Since this is the active test, the next one in the loop has to be the 
			    // next test:
			    next_triggers=true;
			}
			else if (  usertest.testsdone[ task_index ][  trial_index ] ) {
			    style="past";
			}
			else {
			    style="future";
			    if (next_triggers==true) {
				console.log('next triggered!');
				if (  usertest.testsdone[ task_index ][  trial_index ] == false ) { 
				    nexttask = task_index;
				    nexttrial = trial_index;
				    next_triggers=false;
				}
				else {
				    console.log('usertest.testsdone['+ task_index+' ]['+ trial_index+' ] == ' + usertest.testsdone[ task_index ][  trial_index ]  );
				}
			    }
			}
			resp_time=all_trials.
			    filter(function(p) { return p.task_id== task_item }).
			    filter(function(p) { return p.trial_id==trial_item })[0].response_time;
			
			all_tests.push( { task_id: task_index,
					  trial_id: trial_index , 
					  style: style,
					  length: resp_time });
			total_length += parseInt(resp_time);
		    });
		});

		console.log(all_tests);
		console.log("Total_length: "+total_length);

/*
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
				' ] (= '+nexttask+','+nexttrial+'): ' +
				usertest.testsdone[ nexttask ][  nexttrial ] );
		} while ( usertest.testsdone[ nexttask ][  nexttrial ] );

*/

		console.log("Next: "+nexttask+", "+nexttrial);

		next=req.base_url+"/test/user/"+req.user.username+"/task/"+nexttask+"/trial/"+nexttrial;

		console.log("Next task is: "+next);

		console.log("Get the task collection and do stuff: " + usertest.tasks[req.params.task] );

/*		function filterByTaskID(obj, target, fuckall) {
		    console.log('Filtering by target: '+target + ' and');
		    console.log(fuckall);
		    if ('task_id' in obj && obj.task_id === target) {
			return true;
		    } else {
			return false;
		    }
		}


		function filterByTrialID(obj, target) {
		    if ('trial_id' in obj && obj.trial_id === target) {
			return true;
		    } else {
			return false;
		    }
		}*/

		console.log('Filtering by task_id==='+usertask);
		//console.log( all_tasks.filter(filterByTaskID, usertest.tasks[req.params.task]) )

		
		task = all_tasks.
		    filter(function(p) { return p.task_id == usertask })[0];
		
		
		task.trial=all_trials.
		    filter(function(p) { return p.task_id== usertask }).
		    filter(function(p) { return p.trial_id==usertrial })[0];


		console.log("This task & trial: " + task.task_id + " and trial: "+ task.trial.trial_id);

		task.next= next;

		task.showinstructions = showinstructions;

		task.all_tests=all_tests;
		task.total_length=total_length;

		// Return the description in JSON form; Is this a good idea? Hopefully.
		// We do aim to have a single web page that will be refreshed with javascript.
		res.json(task);
	    });				 
	});    
    });
    

});




module.exports = router;
