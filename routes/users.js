var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/userlist', function(req, res) {
    var db = req.db;
    var collection = db.get('userlist');
    collection.find({},{},function(e,docs){
        res.json(docs);
    });
});


/*
 * POST to adduser.
 */
router.post('/adduser', function(req, res) {

    /* Define shuffle function, might as well do it here. 
       It is from http://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array-in-javascript
    */ 
    function shuffle(o){
	for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
	return o;
    }
    
    console.log("Trying to add user:");


    var db = req.db;

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
	

	req.body.tasks=usertasks;
	req.body.trials=usertrials;

	req.body.password="codeme!";

	var collection = db.get('userlist');

	collection.insert(req.body, function(err, result){
            res.send(
		(err === null) ? { msg: '' } : { msg: err }
            );
	});
    })
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
