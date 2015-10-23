var express = require('express');
var router = express.Router();


function randomstring(random_string_length) {
    var characters = 'abcdefghjkmnpqrstuvwxyz23456789';
    var string = '';
    for (i = 0; i < random_string_length; i++) {
	string += characters[Math.floor( Math.random() * (characters.length) )];
    }
    return string;
}



/* GET users listing. */
router.get('/', function(req, res, next) {

    if (req.user.role == 'user') {
	res.render('error', {error:{status: 401, stack: ''}, message: 'Not authorised' });
    }
    else {

	var db = req.db;
	var collection = db.get('userlist');
	// Respond with the basic test template:
	res.render('usermanager', { title: 'User management', 
				    username: req.user.username ,
				    user: req.user, 
				    base_url: req.base_url,
				    ui_language: req.ui_language,
				    error_message: req.flash('error'), 
				    success_message: req.flash('error') 
				  }); 
    }
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
    collection.find({'role': 'user'},{sort: {_id:1}},function(e,docs){
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
    
    console.log("Trying to add "+req.params.userrole +" "+req.body.newusername);


    var db = req.db;
    var collection = db.get('userlist');


    var testcollection = db.get('tests');
    /* |  
       |  TODO: Fix this when some test version control
       |        is accomplished
       V                                                */			
    testcollection.findOne( { version: 1 },{},function(e,test){ 
	
	// Check the test proceeding and generate an individual order for
	// trials for this user
	

	addable=req.body;

	addable.role=req.params.userrole;

	var collection = db.get('userlist');
	
	if ( typeof(req.body.newusername) === 'undefined' ) {
	    console.log('(new)username undefined')
	    collection.find({ 'school' : req.body.school}, {fields : { username:1, _id: 0} },function(e,usernamelist){		    		    
		// TODO: Error handling missing!

		var usernames = [];
		if (!e) {
		    usernamelist.forEach(function(item) {
			usernames.push(item.username);
		    });
		}

		var addables=[];
		var resp={};


		if (typeof(req.body.addlist) !== 'undefined') {
		    console.log("addlist: "+req.body.addlist);
		    addlist=req.body.addlist.split(/\r\n|\r|\n/);
		    addcount = addlist.length;
		}
		else {
		    console.log("No addlist!");		   
		    addlist=['n.n.'];
		    addcount=1;
		}
		
		// Remove references to names given by teachers!
		delete addable.userlist;

		for (var y=0; y<addcount; y++) {

		    console.log("addable #"+y);

		    do {
			addable.username=(req.body.school).toLowerCase()+'_'+randomstring(3);
		    } while ( typeof(usernames[addable.username]) !== 'undefined' );

		    addable.password=randomstring(5);


		    // Randomize the trials for this user (group):

		    var usertasks = [];
		    var usertrials = [];
		    var evaluations = {};

		    var i=-1;
		    while ( typeof(test["tasks"][++i]) !== 'undefined') {
			usertasks.push(i);
			evaluations[i]={'phonetic':{}, 'fluency':{}};
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

		    //usertasks.push(i); // Is this a good idea?


		    addable.tasks=usertasks;
		    addable.trials=usertrials;
		    addable.testsdone=testsdone;
		    addable.testcount=0;				
		    addable.evaluations=evaluations; //{'phonetic':{}, 'fluency':{}};


		    usernamelist[addable.username] = true;

		    //Ad-hoc copy of object:
		    addables.push( JSON.parse(JSON.stringify(addable)));	
		    
		    resp[addlist[y]]=addable.username + '   ' +addable.password;
		    
		}
		

		collection.insert(addables, function(err, result){
		    res.send(
			(err === null) ? { msg: '', userlist: resp } : { msg: err }
		    );
		});
		
		// Add the user to database;

	    });
	}
	else {
	    console.log('(new)username defined: '+ req.body.newusername)

	    collection.findOne({ 'username':req.body.newusername},  {fields : { username:1, _id: 0}  },function(err,founduser){ 
		
		if (err) { /* handle err */ }
		
		if (founduser) {
		    res.send(
			{ msg: "Username "+req.body.newusername+" taken" }
		    );			
		}
		else {
		    addable.username=req.body.newusername;
		    delete addable.newusername;

		    collection.insert(addable, function(err, result){
			res.send(
			    (err === null) ? { msg: '' } : { msg: err }
			);
		    });
		}
	    });
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
