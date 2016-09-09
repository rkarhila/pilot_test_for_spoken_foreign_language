
var fs = require('fs');

var listening_dirs = [];
var heard_files = [];

const exec = require('child_process').exec;

var start_listening = function() {
    fs.watch('./classification_data/pickles/', {encoding: 'buffer'}, (eventType, filename) => {
	if (filename)
	    console.log("New pickle written: " + filename);
	// Prints: <Buffer ...>
    });

    
    fs.watch('./uploads/validator_data/', {encoding: 'buffer'}, (eventType, userdir) => {
	if (userdir) {	    
	    console.log("New dir written: " + userdir);
	    if (listening_dirs.indexOf(userdir) < 0) { 
		var this_dir = userdir;
		listening_dirs.push(this_dir);
		fs.watch('./uploads/validator_data/'+userdir, {encoding: 'buffer'}, (eventType, labname) => {
		    if (labname == '16.8.lab') {
			if (heard_files.indexOf(userdir + '/' + labname) < 0) {
			    heard_files.push(userdir + '/' + labname);
			    console.log(eventType);
			    console.log('Start feature extraction!');
			    
			    var extractioncmd = 'dnn_runner/from_wav_to_classes.sh '+userdir;

			    exec(extractioncmd);
			    
			    var waveletcmd = '/l/opt/wavelet_prosody_analyzer/produce_wavelet_analyses.sh `pwd`/uploads/validator_data/' + userdir + ' `pwd`/public/images/wavelets'

			    exec(waveletcmd);

			}
		    }
		});
	    }
	}
    });



}


module.exports = { 'start_listening': start_listening };
