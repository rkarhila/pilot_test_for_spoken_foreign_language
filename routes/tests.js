var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/task/:task/trial/:trial', function(req, res, next) {
  //res.send('respond with a resource');
    console.log( req.params.task );
    console.log( req.params.trial );
    res.render('tests', { title: 'Testing!' });
});


module.exports = router;
