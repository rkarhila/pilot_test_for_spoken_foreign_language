var express = require('express');
var router = express.Router();
var fs = require('fs');

/* GET home page. */
router.get('/', function(req, res, next) {

    if (!req.user) {
	
	//console.log('Trying to get changelog');

	var changelog = JSON.parse(fs.readFileSync('./changelog.json', 'utf8'));
	//console.log('Got changelog');

	res.render('login', { title: 'Express',
			      changelog: changelog,
			      base_url: req.base_url,
			      ui_language: req.ui_language, 
			      error_message: req.flash('error'), 
			      success_message: req.flash('error'),
			    });
    }
    else {
	if (req.user.role == 'user') {
            res.redirect(req.base_url+'/test');
	}
	else {
	    res.render('index', {  title: 'User management', 
				   username: req.user.username ,
				   base_url: req.base_url,
				   user: req.user, 
				   ui_language: req.ui_language,
				   error_message: req.flash('error'), 
				   success_message: req.flash('error') 
				});	    
	}
    }
    



    //res.render('index', { title: 'Express', message : req.flash('info') });
});

router.post('/api/photo',function(req,res){
  if(done==true){
    console.log(req.files);
    res.end("File uploaded.");
  }
});


module.exports = router;
