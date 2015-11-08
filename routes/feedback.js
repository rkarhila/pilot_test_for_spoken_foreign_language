var express = require('express');
var router = express.Router();
var fs = require('fs');

var exec = require('child_process').exec;


router.post('/', function(req, res, next) {

    console.log("Feedback given:");

    console.log(req.body);
    console.log(req.is('json'));

    
    var bgPattern = new RegExp(/^([^-]+)\-(.+)$/);
    
    var background = {};
    var feedback = {};
    var arrMatches;

    Object.keys(req.body).forEach( function(feedback_item) {
	console.log('feedback_item: '+feedback_item);

	arrMatches = feedback_item.match(bgPattern);

	if (arrMatches[1] == 'background') {
	    background[arrMatches[2] ] = req.body[feedback_item];
	}
	else if (arrMatches[1] == 'feedback') {
	    feedback[arrMatches[2] ] = req.body[feedback_item];
	} 
	else {
	    console.log('item '+feedback_item+' not feedback nor background');
	}	  
    });

    var db = req.db;    

    usercollection = db.get('userlist');

    usercollection.update({ "username": req.user.username  }, 
                      { $set:  {background: background} }, 
                      function(err,result){
			  
			  if (err) {
			      req.flash('error', 'Taustatietojen kirjaaminen epäonnistui');
			  }
			  else {
			      req.flash('success', 'Taustatietojen kirjaaminen onnistui');
			  }
			  
			  feedback['test_version'] = req.user.testversion;
			  feedback['school'] = req.user.school;
			  feedback['created'] = new Date().toISOString();

			  testcollection = db.get('feedback');			  
			  testcollection.insert(feedback, function(err, result){
			      			      
			      if (err) {
				  req.flash('error', 'Palautteen kirjaaminen epäonnistui');
			      }
			      else {
				  req.flash('success', 'Palautteen kirjaaminen onnistui');
			      }
			      res.redirect(req.base_url+'/feedback/thanks');
			  });
		      });
});
    



router.get('/thanks', function(req,res,next){
   res.render('feedback-thanks', { title: 'Testing!', 
				user: req.user , 
				base_url: req.base_url,
				ui_language: req.ui_language,
				error_message: req.flash('error'), 
				success_message: req.flash('error') 
			   }); 
});

router.get('/', function(req, res, next) {

    //var db = req.db;    
    //testcollection = db.get('tests');
    //testcollection.findOne( {version: 2}, {}, function(e,test) {	    

    
    // Respond with the test view/edit template:
    res.render('feedback', { title: 'Testing!', 
				user: req.user , 
				base_url: req.base_url,
				ui_language: req.ui_language,
				error_message: req.flash('error'), 
				success_message: req.flash('error') 
			   });
});





module.exports = router;
