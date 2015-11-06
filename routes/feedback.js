var express = require('express');
var router = express.Router();
var fs = require('fs');

var exec = require('child_process').exec;


router.post('/', function(req, res, next) {
    res.redirect(req.base_url+'/feedback/thanks');

})

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
