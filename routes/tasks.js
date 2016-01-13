var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

    if (req.user.role == 'user') {
	console.log('redirecting from tasks to test');
	res.redirect('/test');
    }
    else {
	
	var db = req.db;    
	testcollection = db.get('tests');
	testcollection.find( {version: { $in: ['3b','3c'] }}, {}, function(e,tests) {	    

	    console.log(tests);

	    // Respond with the test view/edit template:
	    res.render('testmanager', { title: 'Testing!', 
					user: req.user , 
					base_url: req.base_url,
					tests: tests,
					ui_language: req.ui_language,
					error_message: req.flash('error'), 
					success_message: req.flash('error') 
				      });
	});
    }
    
});


router.get('/all', function(req, res, next) {
    
    var db = req.db;    
    
    taskcollection = db.get('tasks');
    taskcollection.find( {}, {}, function(e,all_tasks) {
	
	trialcollection = db.get('trials');
	trialcollection.find({},{},function(e,all_trials){
	    

	    // Assign the trials to their parent tasks:
	    all_trials.forEach(function (trial) {
		
		if (typeof(all_tasks[trial.task_id].trials) == 'undefined') {
		    all_tasks[trial.task_id].trials={};
		}
		all_tasks[trial.task_id].trials[trial.trial_id] = trial;
	    });
    
	    res.json(all_tasks);
	    
	});
    });
});




module.exports = router;
