var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// Database
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/nodetest2');


var multer  = require('multer');

var routes = require('./routes/index');
var users = require('./routes/users');
var test = require('./routes/test');
var uploads = require('./routes/uploads');
//var signin = require('./routes/signin');
var answers = require('./routes/answers');
var evaluate = require('./routes/evaluate');



// User management imports:
var passport = require('passport');
var flash = require('connect-flash');
//var login = require('./routes/login');


// A little help from:
// https://orchestrate.io/blog/2014/06/26/build-user-authentication-with-node-js-express-passport-and-orchestrate/
//var config = require('./config.js'); //config file contains all tokens and other private info
//var funct = require('./functions.js'); //funct file contains our helper functions for our Passport and database work

var session = require('express-session');
var app = express();





// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json({ limit: '200mb' }));
app.use(bodyParser.urlencoded({ extended: true }));


// Session control: User information in cookies etc?

app.use(session({ secret: 'keyboard cat',
                  saveUninitialized: true,
                  resave: true,
		  cookie: { maxAge: 3600000 }})); // Cookie lifetime: 1 hour

var sess;




app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


/*
// Session-persisted message middleware
app.use(function(req, res, next){
  var err = req.session.error,
      msg = req.session.notice,
      success = req.session.success;

  delete req.session.error;
  delete req.session.success;
  delete req.session.notice;

  if (err) res.locals.error = err;
  if (msg) res.locals.notice = msg;
  if (success) res.locals.success = success;

  next();
});
*/


/*
 *     DATABASE CONNECTION
 *
 */



// Make our db accessible to our router
app.use(function(req,res,next){
    req.db = db;
    next();
});


/*
 *     FLASH MESSAGES
 *
 */



// Flash messages:
app.use(flash());

//  Flash messages:
//app.use(function(req,res,next){
//    req.flash= flash;
//    next();
//});



/*
 *     AUTHENTICATION
 *
 */



app.use(passport.initialize());
app.use(passport.session());

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;


User = db.get('userlist');

passport.use(new LocalStrategy(
  function(username, password, done) {
      //console.log("LocalStrategy working...");
      User.findOne({ username: username }, function(err, user) {
	  if (err) {
	      console.log("Auth failed: username : "+username+ " password: "+password);
	      return done(err); }
	  if (!user) {
              return done(null, false, { message: 'Incorrect username.' });
	  }
	  if (user.password !== password) {
              return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }
));


passport.serializeUser(function(user, done) {
    //console.log('Serializing: ', user);
    done(null, user);
});

passport.deserializeUser(function(obj, done) {
    //console.log('Deserializing: ', id);
    //console.log('Deserializing');
    done(null, obj);
});






/*
 *     LANGUAGE
 *
 */


// Specify language of the UI:
app.use(function(req,res,next){
    req.ui_language= 'fi_fi';
    next();
});





/*
 *     UPLOADS WITH MULTIPART FORMS
 *
 */


/*Configure the multer.*/

app.use(multer({ dest: './uploads/',
 rename: function (fieldname, filename) {
    return filename+Date.now();
  },
onFileUploadStart: function (file) {
  console.log(file.originalname + ' is starting ...')
},
onFileUploadComplete: function (file) {
  console.log(file.fieldname + ' uploaded to  ' + file.path)
  done=true;
}
}));





/*
 *     ROUTING
 *
 */

app.get('/login', function(req, res, next) {
    User.find({}, function(err, user) {
	res.render('login', { title: 'Express',
			      user: req.user ,
			      ui_language: req.ui_language,
			      error_message: req.flash('error'),
			      success_message: req.flash('error'),
			      all_users : user
			    });
    });
});


app.post('/login',
	 passport.authenticate('local',
			       { failureRedirect: '/login',
				 failureFlash: true }),
	 function(req, res) {
	     sess=req.session;
	     sess.username=req.body.username.value;
             res.redirect('/test');
	 });

/*
app.use(function(req,res,next){
    console.log(req.user);
    next();
});
*/

app.use('/', routes);

// app.use('/login', login);
//app.use('/signin', auth);


// Require authentication for the other urls:

app.use(function(req,res,next){
    if(req.isAuthenticated()) {
	console.log('user logged in', req.user.username);
    }
    else {
	console.log('user not logged in');
	res.redirect('/login');
    }

    sess = req.session;
    if (typeof(sess.username) !== 'undefined')
    {
	req.params.user = sess.username;
    }
    next();
});



app.use('/users', users);



//app.use(ensureAuthenticated);

app.use('/test', test);
app.use('/upload', uploads);
app.use('/answers', answers);
app.use('/evaluate', evaluate);





/*
 *    ERROR HANDLING
 *
 */


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
