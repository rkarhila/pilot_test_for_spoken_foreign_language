var express = require('express');
var router = express.Router();
var fs = require('fs');


/* POST upload file. */
router.post('/',  function(req, res, next) {

    console.log("List of req.body entities:"); // form files
    for (name in req.body) {
        if (req.body.hasOwnProperty(name)) {
            console.log("Key: " + name);
	    for (name2 in req.body[name]) {
		if (req.body[name].hasOwnProperty(name2)) {
		    console.log("Key: " + name + "."+name2.substring(0, 10));
		}
	    }
	}	
    }
    console.log("That was it."); // form files


    var files = req.body;
    
    // writing audio file to disk
    
    filePath = './uploads/'+req.body.video.name+'.webm';
    
    filecontents = files.video.contents.split(',').pop();
    fileBuffer = new Buffer(filecontents, "base64");
    fs.writeFileSync(filePath, fileBuffer);
    var savemsg = 'Tallennettiin palvelimelle '+req.body.video.name;

    if (!files.isFirefox) {
	filePath = './uploads/'+req.body.audio.name+'.wav';
	filecontents = files.audio.contents.split(',').pop();
	fileBuffer = new Buffer(filecontents, "base64");
	fs.writeFileSync(filePath, fileBuffer);	
	savemsg += ' ja '+req.body.audio.name;
    }

    res.json({ response: 'ok!', msg: savemsg, errorcode: "0" });
});


function merge(response, files) {
    // detect the current operating system
    var isWin = !!process.platform.match( /^win/ );

    if (isWin) {
        ifWin(response, files);
    } else {
        ifMac(response, files);
    }
}

function _upload(response, file) {
    var fileRootName = file.name.split('.').shift(),
        fileExtension = file.name.split('.').pop(),
        filePathBase = config.upload_dir + '/',
        fileRootNameWithBase = filePathBase + fileRootName,
        filePath = fileRootNameWithBase + '.' + fileExtension,
        fileID = 2,
        fileBuffer;

    while (fs.existsSync(filePath)) {
        filePath = fileRootNameWithBase + '(' + fileID + ').' + fileExtension;
        fileID += 1;
    }

    file.contents = file.contents.split(',').pop();

    fileBuffer = new Buffer(file.contents, "base64");

    fs.writeFileSync(filePath, fileBuffer);
}

function serveStatic(response, pathname) {

    var extension = pathname.split('.').pop(),
        extensionTypes = {
            'js': 'application/javascript',
            'webm': 'video/webm',
            'gif': 'image/gif'
        };

    response.writeHead(200, {
        'Content-Type': extensionTypes[extension]
    });
    if (extensionTypes[extension] == 'video/webm')
        response.end(fs.readFileSync('.' + pathname));
    else
        response.end(fs.readFileSync('./static' + pathname));
}



module.exports = router;
