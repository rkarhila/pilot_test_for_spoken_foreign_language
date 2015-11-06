var express = require('express');
var router = express.Router();
var fs = require('fs');

var exec = require('child_process').exec;


router.get('/video/:video', function(req, res, next) {

    if (req.user.role == 'user') {
	res.json({msg: 'No privileges for viewing'});
    }
    else {
	var file = './uploads/encoded_video/'+req.params.video;
	var range = req.headers.range;
	var positions = range.replace(/bytes=/, "").split("-");
	var start = parseInt(positions[0], 10);

	fs.stat(file, function(err, stats) {
	    if (err) 
	    {
		res.json(err);
	    }
	    else if (typeof(stats) == 'undefined')
	    {
		res.json({msg: req.params.video + " file undefined"});
	    }
	    else {
		var total = stats.size;
		var end = positions[1] ? parseInt(positions[1], 10) : total - 1;
		var chunksize = (end - start) + 1;
		
		res.writeHead(206, {
		    "Content-Range": "bytes " + start + "-" + end + "/" + total,
		    "Accept-Ranges": "bytes",
		    "Content-Length": chunksize,
		    "Content-Type": "video/mp4"
		});
		
		var stream = fs.createReadStream(file, { start: start, end: end })
		    .on("open", function() {
			stream.pipe(res);
		    }).on("error", function(err) {
			res.end(err);
		    });
	    }
	});
    }
});


module.exports = router;
