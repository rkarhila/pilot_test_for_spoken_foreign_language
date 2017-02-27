var express = require('express');
var router = express.Router();
var exec = require('child_process').exec;

var session = require('express-session');

var base_url=(process.env.BASE_URL || '');
var fs = require('fs');


router.get('/full_test', function(req, res, next) {
    render_test(req, res, next, "full");
});


router.get('/short', function(req, res, next) {
    render_test(req, res, next, "short");
});

router.get('/assisted_short', function(req, res, next) {
    render_test(req, res, next, "assisted_short");
});

router.get('/holding_your_hand_short', function(req, res, next) {
    render_test(req, res, next, "holding_your_hand_short");
});

var render_test = function(req, res, next, test_type) {
    console.log('Starting test of type '+test_type);
    
    if (req.body.username) {
	req.user = { 'username' : req.body.username}
    }
    else {
	if (req.user) {
	    dummy = 1;
	}
	else {
	    req.user = get_new_user();
	}
    }
    
    sess=req.session;
    sess.username = req.user;
  //req.body.username.value;

    

    res.redirect(base_url+'/u/'+req.user.username +'/test/'+test_type);

/*    res.render('init_test',  { title: 'Testing!', 
			  user: req.user, 
			  base_url: req.base_url,
			  ui_language: req.ui_language,
			  error_message: req.flash('error'), 
			  success_message: req.flash('error'),
			  noVideo: (process.env.NOVIDEO || 0),
			  test_review : "0", //test_review,
			  test_type: test_type
			});
*/
}

var get_new_user = function() {

    var high=100;
    var low=10;
    var allowed_chars=[]

    var vow= ['a','e','i','o','u','y'];
    var con= ['b','c','d','f','g','h','k','m','n','p','r','s','t','v','z','x']; // Dropped out 'l'!

    ran = 'aadap';

    while (true) {
	
	try {
	    fs.accessSync('uploads/raw_video/'+ran, fs.F_OK);
	    // Do something
	    var ran = '';
	    
	    if (Math.random() < 0.5) {
		ran += vow[Math.floor(Math.random() * vow.length)];
		ran += con[Math.floor(Math.random() * con.length)];
		ran += vow[Math.floor(Math.random() * vow.length)];
		ran += con[Math.floor(Math.random() * con.length)];
		ran += vow[Math.floor(Math.random() * vow.length)];
	    }
	    else {
		ran += con[Math.floor(Math.random() * con.length)];
		ran += vow[Math.floor(Math.random() * vow.length)];
		ran += con[Math.floor(Math.random() * con.length)];
		ran += vow[Math.floor(Math.random() * vow.length)];
		ran += con[Math.floor(Math.random() * con.length)];
	    }	  
	} catch (e) {
	    break;
	    // It isn't accessible
	}
    }

    fs.mkdirSync('uploads/raw_video/'+ran);
    fs.mkdirSync('uploads/encoded_video/'+ran);

    return {'username' : ran };
    
}


/* GET home page. */
router.get('/', function(req, res, next) {

    
    if (req.user.role == 'user') {
	// Respond with the basic test template:

        var test_review=[];

        var db = req.db;
	var collection = db.get('userlist');

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
		

                    all_tasks.forEach( function(thistask) { 
			
			var taskdict = { task_id : thistask.task_id };
			
			console.log(usertest);
			
			taskdict.num_trials = usertest.trials[usertest.tasks.indexOf(thistask.task_id)].length;
			
			var trial_lengths;
			var maxtime=0;
			var mintime=10000;
			all_trials.forEach(function(thistrial) {
			    if (thistrial.task_id == thistask.task_id) {
				if (thistrial.response_time < mintime) {
				    mintime = thistrial.response_time;
				}
				if (thistrial.response_time > maxtime) {
				    maxtime = thistrial.response_time;
				}			
			    }
			});
			trial_lengths = (maxtime)+" s";
			if (mintime != maxtime) {
			    trial_lengths = (mintime)+"-"+trial_lengths;
			}
			
			taskdict.trial_lengths = trial_lengths;
			
			taskdict.description = thistask.description;		   		    
			
			test_review[usertest.tasks.indexOf(thistask.task_id)] = taskdict;
			
		    });
		    
		    res.render('tests', { title: 'Testing!', 
					  user: req.user , 
					  base_url: req.base_url,
					  ui_language: req.ui_language,
					  error_message: req.flash('error'), 
					  success_message: req.flash('error'),
					  noVideo: (process.env.NOVIDEO || 0),
					  test_review : test_review
					});
		});		
	    });		    
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

    //var showinstructions = (req.params.trial < 1);
    var showinstructions;

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
		var usertask=req.params.task;
		var usertrial=req.params.trial;

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
		    console.log(task_index+ " -->  "+task_item);
		    usertest.trials[task_index].forEach(function(trial_item, trial_index) {
			
			console.log(task_index+'.'+trial_index +" --> " + task_item+'.'+trial_item);
			
			if (  task_item == req.params.task && trial_item == req.params.trial ) {
			    style="now";
			    if (trial_index == 0) {
				showinstructions = true;
			    }

			    // Since this is the active test, the next one in the loop has to be the 
			    // next test:
			    next_triggers=true;
			}
			else if (  usertest.testsdone[ task_item ][  trial_item ] ) {
			    style="past";
			}
			else {
			    style="future";
			    if (next_triggers==true) {
				console.log('next triggered!');
				if (  usertest.testsdone[ task_item ][  trial_item ] == false ) { 
				    nexttask = task_item;
				    nexttrial = trial_item;
				    next_triggers=false;
				}
				else {
				    console.log('usertest.testsdone['+ task_item+' ]['+ trial_item+' ] == ' + usertest.testsdone[ task_item ][  trial_item ]  );
				}
			    }
			}
			resp_time=all_trials.
			    filter(function(p) { return p.task_id== task_item }).
			    filter(function(p) { return p.trial_id==trial_item })[0].response_time;
			
			all_tests.push( { task_id: task_item,
					  trial_id: trial_item , 
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

		console.log('Filtering by task_id==='+usertask+' and trial_id=='+usertrial);
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
