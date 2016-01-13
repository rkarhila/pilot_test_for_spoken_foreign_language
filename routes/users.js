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
    if (req.user.role=='teacher' || req.user.role=='local-admin') {		
	collection.find({'role': 'global-admin', 'status':'active'},{ fields : {password:0}},function(e,docs){
	    collection.find({'role': 'local-admin', 'school': req.user.school, 'status':'active'},{ fields : {password:0}},function(e,docs2){	    
		res.json(docs.concat(docs2));
	    });
	});
    }
    else {
	collection.find({'role': { $in: ['local-admin', 'global-admin']}, 'status':'active'},{ fields : {password:0}},function(e,docs){
            res.json(docs);
	});
    }
});

router.get('/userlist/teachers', function(req, res) {
    var db = req.db;
    var collection = db.get('userlist');

    if (req.user.role=='teacher' || req.user.role=='local-admin') {	
	collection.find({'role': 'teacher', 'school' : req.user.school, 'status':'active'},{fields : {password:0}},function(e,docs){
            res.json(docs);
	});
    }
    else 
    {
	collection.find({'role': 'teacher', 'status':'active'},{fields : {password:0}},function(e,docs){
	    res.json(docs);
	});
    }
});


router.get('/userlist/users', function(req, res) {
    var db = req.db;
    var collection = db.get('userlist');

    if (req.user.role=='teacher' || req.user.role=='local-admin') {	
	collection.find({'role': 'user', 'school': req.user.school, 'status':'active' },{sort: {_id:1}},function(e,docs){
            res.json(docs);
	});
    }
    else {
	collection.find({'role': 'user', 'status':'active'},{sort: {_id:1}},function(e,docs){
            res.json(docs);
	});
    }
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

    testcollection.find( { version: { $in: ["3b", "3c" ] }},{},function(e,tests){ 
	
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


		    if (Math.random()<0.5) {
			ver='3b';
			test = tests[0];
		    }
		    else {
			ver = '3c';
			test = tests[1];
		    }

		    console.log("addable #"+y);

		    do {
			addable.username=(req.body.school).toLowerCase()+'_'+randomstring(3);
		    } while ( typeof(usernames[addable.username]) !== 'undefined' );

		    addable.password=randomstring(5);


		    // Randomize the trials for this user (group):

		    var usertasks = [];
		    var usertrials = [];
		    var evaluations = {};

		    var testsdone = {};

		    //var i=-1;


		    for (var i=0; i< test.tasks.length; i++) {
			var task=test.tasks.filter(function(p) { return p.task_order== i })[0];

			usertasks.push(task.task_id);
			evaluations[task.task_id] = {'phonetic':{}, 'fluency':{}};
			testsdone[task.task_id] = {};
			
			trialcounts=task["trial_counts"];
			for (var j = 0; j < trialcounts.length; j++) {

			    var pool=task["trial_pools"][j];
			    var trialcount=trialcounts[j];

			    if (task["random_order"]=="yes") {
				shuffled_pool=shuffle(pool);
				usertrials.push(shuffled_pool.slice(0,trialcount) )

			    }
			    else {
				usertrials.push(pool.slice(0,trialcount) )		    
			    }
			}
			usertrials[i].forEach( function(trial_id) {
			    testsdone[ task.task_id ][trial_id] = false;
			});	
		    }
			

		    /*
		    while ( typeof(test["tasks"][++i]) !== 'undefined') {
			usertasks.push( test["tasks"][i].task_id );

			evaluations[ test["tasks"][i].task_id ]={'phonetic':{}, 'fluency':{}};

			testsdone[ test["tasks"][i].task_id ] = {};

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
			usertrials[i].forEach( function(trial_id) {
			    testsdone[ test["tasks"][i].task_id ][trial_id] = false;
			});
		    }
		    */


		    // Add-on: An array of all tasks and trials to make it easier to handle:
		    /*
		    var testsdone={};

		    for(var task in usertasks){

			testsdone[task]={};

			for (var trial in usertrials[task]) {
			    testsdone[task][trial]= false;
			}
		    }
		    */
		    //usertasks.push(i); // Is this a good idea?

		    addable.testversion = ver;


		    addable.tasks=usertasks;
		    addable.trials=usertrials;
		    addable.testsdone=testsdone;
		    addable.testcount=0;				
		    addable.evaluations=evaluations; //{'phonetic':{}, 'fluency':{}};

		    addable.status= 'active';

		    addable.created = new Date().toISOString();
		    addable.last_modified = addable.created;

		    addable.created_by= req.user.username;
		    addable.last_modified_by= req.user.username;

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

		    addable.status= 'active';

		    addable.created = new Date().toISOString();
		    addable.last_modified = addable.created;

		    addable.created_by= req.user.username;
		    addable.last_modified_by= req.user.username;



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
    //collection.remove({ '_id' : userToDelete }, function(err) {
    collection.update({ '_id': req.params.id  }, 
                      { $set:  {status: 'deleted' } }, 
		      function(err) {
			  res.send((err === null) ? { msg: '' } : { msg:'error: ' + err });
		      });
});

module.exports = router;
