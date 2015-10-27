var express = require('express');
var router = express.Router();



var match_interval = 5 * 1000; // 5s interval for checking pairings:
var max_timedelta = 7 * 1000 // 60s max time for making a match

function timestamp() {
    return Date.now();
}

router.get('/cancel',  function(req, res, next) {
    var db = req.db;    
    var collection = db.get('userlist');

    collection.findOne({ "username" : req.user.username },{},function(e, user){
	user.pairing={user: 'nobody', time: -1, done: false};

	collection.update(	    
	    { "username": req.user.username  }, 
	    { $set:  {pairing: user.pairing} }, 
	    function(e_init,done_init) {
		res.json({code:'099', msg:'Match cancelled.' });
	    }
	);
    });
});

router.get('/:initiator/:target', function(req, res, next) {

    var db = req.db;    
    var collection = db.get('userlist');

    if (req.params.initiator != req.user.username ) {
	// This should not happen: request user and user mentioned in URL
	// do not match.

	res.json({code:'-101', msg:'Väärä käyttäjä / Jotain vikaa sessioinhallinnassa?'});
    }
    else {
	
	var updateinit = false;
	var updatetarget = false;

	collection.find({ "username" : { $in: [req.user.username, req.params.target] }},{},function(e, users){
	    
	    if (e) {
		console.log('Error from database:');
		console.log(e);
	    }

	    var initset = false;
	    var targetset = false;

	    users.forEach(function(user) {
		if (user.username == req.user.username) {
		    console.log(user.username +' initiator!')
		    initiator=user;
		    initset = true;
		}
		else if (user.username == req.params.target) {
		    console.log(user.username +' target!')
		    target=user;
		    targetset=true;
		}
		else {
		    console.log(user.username +' Not cool!')
		}
	    });

	    if (initset == false) {
		console.log('Bad initiator username '+ initiator.username);
		res.json({code:'-101', msg:'Väärä käyttäjä / Jotain vikaa sessioinhallinnassa?'});
	    }	    
	    else if (targetset == false) {
		console.log('Bad target username '+target.username);
		
		res.json={code:'-9', msg:'Tuntematon käyttäjä '+ target.username+'!'};
	    }	    
	    // Badly done looping. What can you do? I'm in a hurry.	

	    
	    else if (   typeof(initiator.pairing) !== 'undefined' 
		     && initiator.pairing.user == target.username 
		     && typeof(target.pairing) !== 'undefined' 
		     && target.pairing.user == initiator.username 
		     && (parseInt(timestamp()) - parseInt(target.pairing.time)) < max_timedelta )
	    {
		// Cool. Match might be done!
		// Let the games commence!
		console.log('Matching '+initiator.username + ' & '+target.username);
		res.json({code:'101', msg:'Match! Let\'s go right now!' });
	    }
	    else {
		// What happens here?
		// Both target and initiator defined;
		// 
		// If the pairing for the initiator has not been set, 
		// let's set it now (with these two things just to be sure:)
		if (typeof(initiator.pairing) === 'undefined') {
		    console.log('Initiating '+initiator.username + '\'s pairing for '+target.username);
		    initiator.pairing = {user:req.params.target, time: timestamp(), done: false};
		    updateinit=true;
		}
		else if (initiator.pairing.user != req.params.target) {
		    console.log('Changing '+initiator.username + '\'s pairing for '+target.username);
		    initiator.pairing = {user:req.params.target, time: timestamp(), done: false};
		    updateinit=true;
		}
		// If the target pairing is not defined, or is to another user,
		// let's wait until the target defines pairing or changes mind.

		if (typeof(target.pairing) === 'undefined') {
		    console.log('target.pairing === undefined kohteella '+target.username );
		    // Not cool yet. The target has not accepted any pairing yet.		    
		    initiator.pairing.time= timestamp();
		    updateinit=true;		    
		    res_json={code:'10002', msg:'Odotetaan hyväksyntää käyttäjältä '+ target.username+'!'};
		} 
		else if (target.pairing.user !== initiator.username) {
		    console.log('Usernames target: '+ target.pairing.usename + ' and initiator: '+ initiator.username + ' do not match' );
		    initiator.pairing.time= timestamp();
		    updateinit=true;
		    // Also not cool. The target is trying to pair with someone else.
		    res_json={code:'10002', msg:'Odotetaan hyväksyntää käyttäjältä '+target.username+'!'};
		}

		// So, if we come this far, the match is about to happen:
		// We'll just see when the target is next time checking
		// if it's all good to go:
		else {
		    console.log('Usernames match, setting pairing to "done"');
		    
		    // Cool. The target is waiting for the initiator's connection.
		    // We'll wait a little and ask again (confirming and syncing, you know.)
		    res_json={code:'100', 
			      msg:'Match!', 
			      nextcheck: (parseInt(timestamp())-parseInt(target.pairing.time))%match_interval};
		    initiator.pairing.done = true;
		    target.pairing.done = true;
		    updateinit = true;
		    updatetarget = true;
		}
		
		if (updateinit) {
		    collection.update(
			{ "username": initiator.username  }, 
			{ $set:  {pairing: initiator.pairing} }, 
			function(e_init,done_init) {
			    if (updatetarget) {
				collection.update(
				    { "username": target.username  }, 
				    { $set:  {pairing: target.pairing} }, 
				    function(e_target,done_target) {
					// Respond updating both initiator and target:
					res_json.nextcheck=(parseInt(timestamp())-parseInt(target.pairing.time))%match_interval;
					res.json(res_json);
				    }
				);
			    }
			    else {
				// Respond without updating target:
				res.json(res_json);				
			    }
			}
		    );				      
		}
		else {
		    // Respond without updating any fields:
		    res.json(res_json);
		}
	    }
	});
	
    }
});



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

    collection.findOne({ "username" : req.user.username },{},function(e,test){

	// extract the task arrays for this particular user:
	var usertask=test['tasks'][req.params.task];
	var usertrial=test['trials'][req.params.task][req.params.trial];

        var donetrials=test['testsdone'];

	console.log("Finding task " + usertask + " trial " +usertrial + " for user " + req.user.username );

	// Check what is the next task/trial for this user:
	var next;

	console.log("Define next task: (req.params.trial == "+req.params.trial+")");        
        
        nexttask=req.params.task;
        nexttrial=req.params.trial;

	
        do {
	    if ([nexttask]<test['tasks'].length-1) {
	        // If there is another trial for this task, choose that one:
	        if (typeof (test['trials'][nexttask][parseInt(nexttrial)+1]) !== 'undefined') {

                    console.log("Before update: "+nexttask+","+nexttrial);
                    nexttrial = 1+parseInt(nexttrial);

                    console.log("Next trial: "+nexttask+","+nexttrial);

	        }
  	        // If not, then go to trial 0 of the next task:
	        else {

		    console.log("typeof (test['trials']["+nexttask+"]["+(parseInt(nexttrial)+1)+"]) : " +typeof (test['trials'][nexttask][nexttrial+1]) );
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
            console.log('Test done? test.testsdone[ '+
			test['tasks'][nexttask]+
			' ][ '+ 
			test['trials'][nexttrial] +
			' ] : '+ 
			test.testsdone[ test['tasks'][nexttask] ][  test['trials'][nexttask][nexttrial] ] );
        } while ( test.testsdone[ test['tasks'][nexttask] ][  test['trials'][nexttask][nexttrial] ] );



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
