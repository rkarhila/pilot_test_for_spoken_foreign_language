var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express', message : req.flash('info') });
});

router.post('/api/photo',function(req,res){
  if(done==true){
    console.log(req.files);
    res.end("File uploaded.");
  }
});


module.exports = router;
