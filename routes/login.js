var express = require('express');
var router = express.Router();

var passport = require('passport');

// Database
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/nodetest2');

var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;


User = db.get('userlist');

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username: username }, function(err, user) {
      if (err) { 
	  console.log("Auth failed: username : "+username+ " password: "+password);
	  return done(err); }
      if (!user) {
	  console.log("Incorrect username : "+username+ " password: "+password);
          return done(null, false, { message: 'Incorrect username.' });
      }
      if (!user.validPassword(password)) {
	  console.log("Incorrect password : "+username+ " password: "+password);
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }
));




router.post('/', passport.authenticate('local', { successRedirect: '/test',
					       failureRedirect: '/login',
					       failureFlash: true })
);


/* GET home page. */
router.get('/', function(req, res, next) {
    
//    console.log("From Flash:");
//    console.log( req.flash('success_messages') );
//    console.log( req.flash('error_messages') );


    res.render('login', { title: 'Express',
			  user: req.user , 
			  ui_language: req.ui_language, 
			  error_message: req.flash('error'), 
			  success_message: req.flash('error') 
			});
});

/*
router.post('/',function(req,res){
    console.log("foo! Authenticating locally, should this be configured?");
    passport.authenticate('local'),{ 
	successRedirect: '/test',
	successFlash: 'Welcome!', 
        failureRedirect: '/login',
	failureFlash: 'Invalid username or password.'  } 
});
*/	    


	    
	    
	    
module.exports = router;
