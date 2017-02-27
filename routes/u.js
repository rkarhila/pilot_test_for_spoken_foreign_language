var express = require('express');
var router = express.Router();

var base_url=(process.env.BASE_URL || '');

var fs = require('fs');

router.get('/:username/test/:testtype', function(req, res, next) {

    
    if (req.params.testtype == 'short' || 
	req.params.testtype == 'assisted_short' ||
	req.params.testtype == 'holding_your_hand_short'  )
    {
	
	if (req.user) {
	    user = req.user;
	}
	else {
	    req.user = {username: req.params.username};
	}
	
	var test_type = req.params.testtype;
	
	fs.readdir( 'classification_data/results_charts/',  function (err, files){
	    
	    var re = new RegExp(req.user.username,"g");
	    
	    var resultchart = files.filter(function(item){
		return re.test(item);
	    }).length;
	    
	    if (resultchart > 0) {
		res.redirect(base_url+'/u/'+req.user.username +'/results');
	    }	    
	    else {

		fs.readdir(  'uploads/validator_data/'+req.user.username+'/',  function (err, files){
		    
		    if (typeof(files) != 'undefined') {
			var files_uploaded = files.filter(function(item){
			    return /16.[0-8].wav/.test(item);
			}).length;	    
			var start_trial = files_uploaded+1;
		    }
		    else {
			var start_trial = -1;
		    }
			
		    res.render('init_test',  { title: 'Testing!', 
					       user: req.user,
					       base_url: req.base_url,
					       ui_language: req.ui_language,
					       error_message: req.flash('error'), 
					       success_message: req.flash('error'),
					       noVideo: (process.env.NOVIDEO || 0),
					       test_review : "0", //test_review,
					       test_type: test_type,
					       start_trial: start_trial

					     });
		});
		
	    }
	});
    }
    else
    {
	res.render('layout', { user: {username: "no worries"},
			       error_message: 'Unknown test type'} );
	
    }
	   
});

var get_new_user = function() {

    var high=100;
    var low=10;
    var allowed_chars=[]

    var vow= ['a','e','i','o','u','y'];
    var con= ['b','c','d','f','g','h','k','m','n','p','r','s','t','v','z','x']; // Dropped out 'l'!
    
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

    return {'username' : ran };
}


router.get('/:username/checkresults', function(req, res, next) {

    var username = req.params.username;

/*    if (req.user) {
	user = req.user;
    }
    else {
	req.user = {username: req.params.username};
    }*/

    console.log('checking '+ 'uploads/validator_data/'+username+'/');

    var message = 'Working...';

    // Check files uploded:
    fs.readdir( 'uploads/validator_data/'+username+'/',  function (err, files){
	if (typeof(files) == 'undefined' ) {	    
	    res.json(
		{
		    'code': '100', 
		    'message': "Something has gone terribly wrong! Sorry about that. Try again with another device?"
		});	    
	}
	else {
	    //console.log(files);
	    var files_uploaded = files.filter(function(item){
		return /16.[0-8].wav/.test(item);
	    }).length;
	    //console.log("Uploaded files: " + files_uploaded);
	    message = "Uploaded files: " + files_uploaded +"/9";

	    fs.readdir( 'uploads/validator_data/'+username+'/',  function (err, files){

		//console.log(files);
		var files_aligned = files.filter(function(item){
		    return /16.[0-8].lab/.test(item);
		}).length;

		//console.log("Aligned files: " + files_aligned);
		message += "<br>Verified and aligned files: " + files_aligned +"/9";

		fs.readdir( 'classification_data/pickles/',  function (err, files){
		    
		    var re = new RegExp(username,"g");
		    var pickles = files.filter(function(item){
			return re.test(item);
		    }).length;
		    
		    if (pickles > 0)
			message += "<br>Feature pickles: 1/1";
		    else 
			message += "<br>Feature pickles: 0/1";


		    fs.readdir( 'classification_data/results/',  function (err, files){

			var re = new RegExp(username,"g");

			var results = files.filter(function(item){
			    return re.test(item);
			}).length;

			if (results > 0)
			    message += "<br>Segment inspection: Done";
			else 
			    message += "<br>Segment inspection: Not yet";		    

			fs.readdir( 'public/images/wavelets',  function (err, files){
			    
			    //console.log('Wavelet dir contents:');
			    //console.log(files);
			    
			    var re = new RegExp(username,"g");
			    
			    var wavelets = files.filter(function(item){
				return re.test(item);
			    });

			    message += "<br>Wavelet graphs: "+ (wavelets.length) +"/9";
			    
			    
			    fs.readdir( 'classification_data/results_charts/',  function (err, files){

				//console.log('Classification results dir contents:');
				//console.log(files);

	    			var re = new RegExp(username,"g");

				var resultchart = files.filter(function(item){
				    return re.test(item);
				}).length;
				
				if (resultchart > 0) {
				    message += "<br>Results postprocessing: 1/1";			    
				    res.json(
					{
					    'code': '101', 
					    'message': message
					});
				}
				else {
				    message += "<br>Result postprocessing: 0/1";	
				    
				    res.json(
					{
					    'code': '100', 
					    'message': message
					});
				}
			    });
			})
		    })
		});
	    });
	}
    });
});


router.get('/:username/results', function(req, res, next) {
    
    // Gather all the data and dump into a template:

    
    if (req.user) {
	user = req.user;
    }
    else {
	req.user = {username: req.params.username};
    }

    var username = req.params.username;


    var timeInMs = Date.now();
    var expiryTimeInMs = 1473854400000;
    var expiryDate = new Date(expiryTimeInMs).toISOString().
	replace(/T/, ' ').      // replace T with a space
	replace(/\..+/, '') + ' GMT+0'; 

    var expiryHours = Math.ceil((expiryTimeInMs - timeInMs) /( 60  * 60 * 1000));
    var expiryMinutes = Math.round( ((expiryTimeInMs - timeInMs) /(  60 * 1000)) % 60);

    try {
	var scorebuf = fs.readFileSync('classification_data/results_charts/'+username  , "utf8");
    }
    catch (e) {
	var scorebuf = "Your score is not ready yet. Try refreshing after some time";
    }

    results = { 'expiry_date' : expiryDate,
		'expiry_hours' : expiryHours,
		'expiry_minutes' : expiryMinutes,
		'computational_score' : scorebuf
	      };


    res.render('result_page',  { title: 'Your results!', 
				 user: req.user,
				 base_url: req.base_url,
				 ui_language: req.ui_language,
				 error_message: req.flash('error'), 
				 success_message: req.flash('error'),
				 noVideo: (process.env.NOVIDEO || 0),
				 test_review : "0", //test_review,
				 results: results
				 //test_type: test_type
			       });


});


module.exports = router;
