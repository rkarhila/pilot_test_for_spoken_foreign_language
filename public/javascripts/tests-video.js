

// Woohoo!! finally!!! Video time!!!!


// This bit of code is very very heavily based on the demo by

// Muaz Khan     - www.MuazKhan.com
// MIT License   - www.WebRTC-Experiment.com/licence
// Experiments   - github.com/muaz-khan/WebRTC-Experiment



//var startRecording;
var stopRecording;
var cameraPreview;


var audio;
var isFirefox;



function bindControls () {

    cameraPreview = document.getElementById('camera-preview');
    listenButton = document.getElementById('listenbutton');
    audio = document.querySelector('audio');
    
//    $('#startRecording').bind('onclick', startRecording());
}

isFirefox = !!navigator.mozGetUserMedia;
console.log("Is firefox? "+isFirefox);




function playRecording () {
    console.log('Playing sample');
    document.getElementById('recordedObject').play();
    if (controls == "full_forced_listening" ) {
	document.getElementById('recordedObject').addEventListener('ended', activateNext());
	$('#stimulus').html(testListData.stimulus_2);
	//$('#listenButton').attr("hidden", true);
    }
    document.getElementById('recordedObject').play();
}

function activateNext() {
    $('#againButton').attr("hidden", false);
    $('#nextButton').attr("hidden", false);
}



function startVideoCircus() {
    $('#startRecording').attr("hidden", true);
    $('#stimulus').html(testListData.stimulus);

    // MEDIA
    if (testListData.hypermedia !== 'None') {
	if (testListData.mediatype == "video") {
	    console.log("It should be an image!");
	    $('#stimulusmedia').html("<video src=\""+base_url+testListData.hypermedia+"\" autoplay onended='startRecord()'>");
	}
	else {
	    alert("Video not specified!");
	}
    }

}

function continueVideoCircus() {
    $('#stimulus').html(testListData.stimulus);

    // MEDIA
    if (testListData.hypermedia !== 'None') {
	if (testListData.mediatype == "video") {
	    console.log("It should be an image!");
	    $('#stimulusmedia').html("<video src=\""+base_url+testListData.hypermedia+"\" autoplay onended='startRecord()'>");
	}
	else {
	    alert("Video not specified!");
	}
    }
}


function ListenToSampleShowPromptAndStartRecord() {
    $('#stimulus').html(testListData.stimulus);

    if (testListData.hypermedia !== 'None') {
	alert("ListenToSampleShowPromptAndStartRecord() says: \"You're in trouble, I didn't count on this happening!\"");
    }

    console.log('Playing sample pronunciation');
    $('#startRecording').attr("disabled", true);
     
    $('#model_pronunciation_audio').bind('onEnded', startRecord );

    document.getElementById('model_pronunciation_audio').play();    

}


function showPromptAndStartRecord() {
    $('#stimulus').html(testListData.stimulus);

    // MEDIA
    if (testListData.hypermedia !== 'None') {
	console.log("some media 2? "+ testListData.mediatype);
	if (testListData.mediatype == "image") {
	    console.log("It should be an image!");
	    $('#stimulusmedia').html("<img src=\""+base_url+testListData.hypermedia+"\" onload='startRecord();'>");
	}
    }
    // Moved this to onload-tag of the image, let's see if it works:
    else {
     startRecord();
    }
}


var uploadurl;



var recordAudio, recordVideo;

function startRecord() {

    uploadurl=base_url+'/upload/'+ username+'/'+(testListData.task_id)+'/'+(testListData.trial_id);

    console.log("Upload this recording to " + uploadurl);

    $(function() {
	$('#timer').pietimer({
            timerSeconds: responsetime,
            color: '#234',
            fill: false,
            showPercentage: false,
	    showRemainingSecs: true,
            callback: function() {
		stopRecording();		
            }
	});
    });
    
    $('#startRecording').attr("hidden", true);
    //$('#listenButton').attr("disabled", true);

    audio = document.querySelector('audio');
    cameraPreview = document.getElementById('camera-preview');

    isFirefox = !!navigator.mozGetUserMedia;

    //$('startRecording').bind('onclick', startRecording());
    
    $('startRecording').disabled = true;

    var mediaparam = {
        audio: true,
        video: {
	    "mandatory": {
		"maxWidth": videomaxwidth,
                "maxHeight": videomaxheight
	    }
        }
    };


    var userMediaSuccess = function(stream) {

        cameraPreview.src = window.URL.createObjectURL(stream);
        cameraPreview.play();
	
        recordAudio = RecordRTC(stream, {
	    bufferSize: 16384,
	    type: 'audio'
        });
	
	recordVideo = RecordRTC(stream, {
            type: 'video'
	});
	
        recordAudio.startRecording();	

	recordVideo.startRecording();

	
	console.log('Trying to activate stop button');
        $('#stopRecording').attr("hidden", false);
	$('#stopRecording').bind('click', stopRecording);
	$('#stopRecording').bind('touchend', stopRecording);
	
	console.log('Done trying to activate stop button');
    }
    
    var userMediaFailure = function(error) {
	alert(JSON.stringify(error));
    }


    // Old way:
    //navigator.getUserMedia( mediaparam, userMediaSuccess, userMediaFailure );
	



    // Some polyfill code from 
    // https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia#Browser_compatibility

    var promisifiedOldGUM = function(constraints) {
	
    // First get ahold of getUserMedia, if present
	var getUserMedia = (navigator.getUserMedia ||
			    navigator.webkitGetUserMedia ||
			    navigator.mozGetUserMedia);
	
	// Some browsers just don't implement it - return a rejected promise with an error
	// to keep a consistent interface
	if(!getUserMedia) {
	    return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
	}
	
	// Otherwise, wrap the call to the old navigator.getUserMedia with a Promise
	return new Promise(function(resolve, reject) {
	    getUserMedia.call(navigator, constraints, resolve, reject);
	});
	
    }
    
    // Older browsers might not implement mediaDevices at all, so we set an empty object first
    if(navigator.mediaDevices === undefined) {
	navigator.mediaDevices = {};
    }
    
    // Some browsers partially implement mediaDevices. We can't just assign an object
    // with getUserMedia as it would overwrite existing properties.
    // Here, we will just add the getUserMedia property if it's missing.
    if(navigator.mediaDevices.getUserMedia === undefined) {
	navigator.mediaDevices.getUserMedia = promisifiedOldGUM;
    }



    // And now we can make this in an elegant way: (How easy!)
    navigator.mediaDevices.getUserMedia(mediaparam).
	then ( userMediaSuccess ).
	catch ( userMediaFailure );
	

    function stopRecording() {
	$('#timer').pietimer('reset');

	console.log('stopRecording invoked!');
	$('#startRecording').attr("disabled", false);
	$('#stopRecording').attr("disabled", true);


	recordAudio.stopRecording(function() {
            if (isFirefox) onStopRecording();
	});


	var task_id = testListData.task_id;
	var trial_id = testListData.trial_id;

	if (!isFirefox) {
            recordVideo.stopRecording();
            onStopRecording(task_id, trial_id);
	}

	function onStopRecording(task_id, trial_id) {
            recordAudio.getDataURL(function(audioDataURL) {

		document.getElementById('recordedObject').src=audioDataURL;		

		if (!isFirefox) {
		    console.log("Getting data urls for video (not firefox)");
                    recordVideo.getDataURL(function(videoDataURL) {

			//console.log("What is videoDataURL length? "+videoDataURL.length)
			//console.log("What is audioDataURL length? "+audioDataURL.length)
			postFiles(audioDataURL, videoDataURL, task_id, trial_id );
			//UploadFile(cameraPreview.src, "foo");
			//UploadFile(audioDataURL, "foo1");
			//UploadFile(videoDataURL, "foo2");
			
		    });
		} else {
		    postFiles(audioDataURL, testListData.task_id, testListData.trial_id);
		    //postFiles(recordRTC.getBlob());
		}

		$('#stopRecording').attr("hidden", true);
		$('#timer').attr("hidden", true);

		if (controls === "full_forced_listening" ) {
		    $('#listenButton').bind('click', playRecording);
		    $('#listenButton').bind('touchend', playRecording);
		    $('#listenButton').attr("hidden", false);
		}
		else if (controls === "full" ) {
		    $('#listenButton').bind('click', playRecording);
		    $('#listenButton').bind('touchend', playRecording);
		    $('#listenButton').attr("hidden", false);
		    activateNext();	
		}
		else if (controls == "sync_prepare_and_rec") {
		    $('#listenButton').bind('click', playRecording);
		    $('#listenButton').bind('touchend', playRecording);
		    $('#listenButton').attr("hidden", false);
		    $('#recordingWarningText').html('');
		    activateNext();	
		}
		else if (controls === "start_only" || controls === "forced_play" || controls === "start_only_with_visible_stimulus" ) {		    
		    //$('#nextButton').attr("hidden", false);
		    populateTest();
		}
            });
	}
    }
}

var fileName;


function postFiles(audioDataURL, videoDataURL, task_id, trial_id) {
    //fileName = getRandomString();
    fileName = username + '_' + task_id + '_' + trial_id; //(testListData.task_id) + '_' + (testListData.trial_id);

    if (filename_extra > 0) {
	fileName += '_'+filename_extra;
    }


    var files = { 
	isFirefox : isFirefox,
	audio : {
            name: fileName + (isFirefox ? '.webm' : '.wav'),
            type: isFirefox ? 'video/webm' : 'audio/wav',
            contents: audioDataURL
	}
    };	

    if (!isFirefox) {
	//console.log("adding separate video stream!");
        files.video = {
	    name: fileName + '.webm',
	    type: 'video/webm',
	    contents: videoDataURL
        };
    }
 
 
    console.log("typeof files.video.contents: "+typeof(files.video.contents))
    console.log("File length: " + (files.video.contents).length);
    console.log("typeof files.audio.contents: "+typeof(files.audio.contents))
    console.log("File length: " + (files.audio.contents).length);
    
    UploadFile( JSON.stringify(files), fileName+'.*', uploadurl );

}
