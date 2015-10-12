var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    var db = req.db;
    var collection = db.get('userlist');
    // Respond with the basic test template:
    res.render('usermanager', { title: 'User management', 
				username: req.user.username ,
				user: req.user, 
				ui_language: req.ui_language,
				error_message: req.flash('error'), 
				success_message: req.flash('error') 
			}); 
});



router.get('/userlist/admins', function(req, res) {
    var db = req.db;
    var collection = db.get('userlist');
    collection.find({'role': { $in: ['local-admin', 'global-admin']}},{ fields : {password:0}},function(e,docs){
        res.json(docs);
    });
});

router.get('/userlist/teachers', function(req, res) {
    var db = req.db;
    var collection = db.get('userlist');
    collection.find({'role': 'teacher'},{fields : {password:0}},function(e,docs){
        res.json(docs);
    });
});


router.get('/userlist/users', function(req, res) {
    var db = req.db;
    var collection = db.get('userlist');
    collection.find({'role': 'user'},{},function(e,docs){
        res.json(docs);
    });
});

/*
 * GET adduser to add users (what a logic!):
 */
/*
router.get('/adduser', function(req, res) {
    res.render('tests', { title: 'Testing!',     
});
});
*/


/*
 * POST to adduser.
 */
router.post('/adduser/:userrole', function(req, res) {

    /* Define shuffle function, might as well do it here. 
       It is from http://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array-in-javascript
    */ 
    function shuffle(o){
	for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
	return o;
    }
    
    console.log("Trying to add "+req.params.userrole +" "+req.body.username);


    var db = req.db;

    var collection = db.get('userlist');

    collection.findOne( { username: req.body.newusername },{},function(e,foundUser){
	console.log("db reply: >"+e+"<");
	console.log("db result:");
	console.log(foundUser);

	if (!foundUser) {
	    var testcollection = db.get('tests');
                            /* |  
                               |  TODO: Fix this when some test version control
			       |        is accomplished
                               V                                                */
	    
	    

	    testcollection.findOne( { version: 1 },{},function(e,test){ 
		
		// Check the test proceeding and generate an individual order for
		// trials for this user
		
		var usertasks = [];
		var usertrials = [];

		var i=-1;
		while ( typeof(test["tasks"][++i]) !== 'undefined') {
		    usertasks.push(i);
		    
		    trialcounts=test["tasks"][i]["trial_counts"];
		    for (var j = 0; j < trialcounts.length; j++) {

			var pool=test["tasks"][i]["trial_pools"][j];
			var trialcount=trialcounts[j];

			if (test["tasks"][i]["random_order"]=="yes") {
			    shuffled_pool=shuffle(pool);
			    usertrials.push(shuffled_pool.slice(0,trialcount) )
			}
			else {
			    usertrials.push(pool.slice(0,trialcount) )		    
			}
		    }
		}
		
		// Add-on: An array of all tasks and trials to make it easier to handle:

		var testsdone={};

		for(var task in usertasks){
		    testsdone[task]={};
		    for (var trial in usertrials[task]) {
			testsdone[task][trial]= false;
		    }
		}

		usertasks.push(i); // Is this a good idea?

		req.body.tasks=usertasks;
		req.body.trials=usertrials;
		req.body.testsdone=testsdone;
		req.body.testcount=0;				

		req.body.role=req.params.userrole;

		if (!req.body.password) {
		    req.body.password="codeme!";
		}

		addable=req.body;
		addable.username=req.body.newusername;

		var collection = db.get('userlist');

		collection.insert(addable, function(err, result){
		    res.send(
			(err === null) ? { msg: '' } : { msg: err }
		    );
		});
	    })
	}
	else {
	    res.send(
		{ msg: "Username "+req.body.username+" taken" }
	    );
	}
    });    
});



/*
 * DELETE to deleteuser.
 */
router.delete('/deleteuser/:id', function(req, res) {
    var db = req.db;
    var collection = db.get('userlist');
    var userToDelete = req.params.id;
    collection.remove({ '_id' : userToDelete }, function(err) {
        res.send((err === null) ? { msg: '' } : { msg:'error: ' + err });
    });
});

module.exports = router;
