var express = require('express');
var router = express.Router();
var fs = require('fs');

var exec = require('child_process').exec;


router.post('/:user/:task/:trial', function(req, res, next) {

    var audiocodec = 'libvorbis';
    
    var akusfilepath='./uploads/validator_data/' ;

    var uploaduser=req.params.user;
    var uploadtask=req.params.task;
    var uploadtrial=req.params.trial;

    var files = req.body;
    
    // writing audio file to disk
    
    var no_video = (process.env.NOVIDEO || 0);

    var cmd, cmd2, cmd3;

    
    if (true) {

	filePath = './uploads/raw_video/'+uploaduser+'/'+req.body.video.name;
    
	filecontents = files.video.contents.split(',').pop();
	fileBuffer = new Buffer(filecontents, "base64");
	fs.writeFileSync(filePath, fileBuffer);
	var savemsg = 'Saved on server: '+req.body.video.name;
	
	outputfilePath = './uploads/encoded_video/'+uploaduser+'/'+req.body.video.name;

    
	if (!files.isFirefox) {
	    
	    audiofilePath = './uploads/raw_video/'+uploaduser+'/'+req.body.audio.name;
	    audiofilecontents = files.audio.contents.split(',').pop();
	    audiofileBuffer = new Buffer(audiofilecontents, "base64");
	    fs.writeFileSync(audiofilePath, audiofileBuffer);	
	    savemsg += ' ja '+req.body.audio.name;
	    
            cmd='ffmpeg -y -i '+filePath+' -i '+audiofilePath+' -c:v libvpx -c:a '+audiocodec+' -strict experimental '+outputfilePath;


	    var validaudio = akusfilepath + '/'+uploaduser+'/'+ (req.body.audio.name).replace(/_/g, '.');
	    var tmpaudio = akusfilepath+'/tmp/'+ req.body.audio.name;
	    cmd2='ffmpeg -i '+audiofilePath+ ' ' + tmpaudio;
	    cmd3='mv '+ tmpaudio + ' ' + validaudio;
	}
	

	else {
            cmd='ffmpeg -i '+filePath+' -c:v libvpx -c:a libvorbis -strict experimental '+outputfilePath; // >> /home/rkarhila/node_swedish/lets_encode.sh';

	}
    }

    // Create the directory for validator data:
    if (uploadtask == "16" || uploadtask == 16) {

	console.log("Creating directory uploads/validator_data/" + uploaduser);
	try {
	    fs.mkdirSync('uploads/validator_data/'+uploaduser);
	    exec('chmod a+w uploads/validator_data/'+uploaduser, function(error, stdout, stderr) {
		if (error)
		    console.log(error);
	    });
	}
	catch (err) {
	    console.log("I guess the dir uploads/validator_data/"+uploaduser+ " already existed?");
	}
    }		

    exec(cmd, function(error, stdout, stderr) {

        //console.log('Done encoding '+filePath+'; error code: '+error);
        
        if (error) {
	    console.log("Error running:");
	    console.log( cmd );
            res.json({ response: 'Problem!', msg: stderr, errorcode: error }); 
	    
        }
        else {
	    if (req.params.task == "16" || req.params.task == 16 ) {
		
		exec(cmd2, function(error, stdout, stderr) {
		    
		    if (error) {
			console.log("Tried "+cmd2);
			console.log(error);
			console.log(stdout);
			console.log(stderr);		
		    }


		    exec(cmd3, function(error, stdout, stderr) {
			
			if (error) {
			    console.log("Tried "+cmd3);
			    console.log(error);
			    console.log(stdout);
			    console.log(stderr);
			}
			
			console.log("Wrote "+ outputfilePath)
			var params= req.params;
			
			//if (params.task == "16" && params.trial == "8") {
			// Fire off the Kaldi validator scripts:
			// Oh no we don't. Let's rely on the listeners!
			//}
			

			res.json({ response: 'ok!', msg: 'videos/'+params.user+"/"+params.task+"/"+params.trial, errorcode: "0" });
			
		    });
		});
            }
	    else {
		var params= req.params;

		res.json({ response: 'ok!', msg: 'videos/'+params.user+"/"+params.task+"/"+params.trial, errorcode: "0" });
		
	    }
	}
    });
});



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
