// Userlist data array for filling in info box
var userListData = [];

var nextUrl= '/test/user/'+username+'/task/0/trial/0';
var maxrectime = 5;
var allowRerecording = false;

var uservideo;
var globalmediastream;

var videomaxwidth = 200;
var videomaxheight = 150;

// DOM Ready =============================================================
$(document).ready(function() {

    // Populate the user table on initial page load
    populateTest();
    $('#btnNext').on('click', populateTest );

});

// Functions =============================================================


// A little helper used by the old scripts:
// getElementById
function $id(id) {
    return document.getElementById(id);
}


function showTrial( data ) {
    
    // Empty content string
    var testContent = '';
    
    // Stick our test data array into a testlist variable in the global object
    testListData = data;
    $('#testTask_id').text(data.task_id);
    $('#testInstructions').text(data.instructions);
    $('#testStimulus_layout').text(data.stimulus_layout);
    
    $('#testTrial_id').text(data.trial.trial_id);
    $('#testStimulus').text(data.trial.stimulus);
    
    $('#testNext').text(data.next);
    
    maxrectime=(data.trial.response_time);

    console.log(data);
    
    nextUrl=data.next;

}


function populateTest( ) {
    //console.log('populating ' + nextUrl);
    
    // jQuery AJAX call for JSON
    $.getJSON( nextUrl, function( data ) {showTrial( data ) });
}




// Woohoo!! finally!!! Video time!!!!


// This bit of code is very very heavily based on the demo by

// Muaz Khan     - www.MuazKhan.com
// MIT License   - www.WebRTC-Experiment.com/licence
// Experiments   - github.com/muaz-khan/WebRTC-Experiment



var startRecording = document.getElementById('start-recording');
var stopRecording = document.getElementById('stop-recording');
var cameraPreview = document.getElementById('camera-preview');

var audio = document.querySelector('audio');

var isFirefox = !!navigator.mozGetUserMedia;

var recordAudio, recordVideo;
startRecording.onclick = function() {
    startRecording.disabled = true;
    navigator.getUserMedia({
        audio: true,
        video: {
            "mandatory": {
		"maxWidth": videomaxwidth,
                "maxHeight": videomaxheight
            }
        }
    }, function(stream) {
        cameraPreview.src = window.URL.createObjectURL(stream);
        cameraPreview.play();

        recordAudio = RecordRTC(stream, {
            bufferSize: 16384
        });

        if (!isFirefox) {
            recordVideo = RecordRTC(stream, {
                type: 'video'
            });
        }

        recordAudio.startRecording();

        if (!isFirefox) {
            recordVideo.startRecording();
        }

        stopRecording.disabled = false;
    }, function(error) {
        alert(JSON.stringify(error));
    });
};


stopRecording.onclick = function() {
    startRecording.disabled = false;
    stopRecording.disabled = true;

    recordAudio.stopRecording(function() {
        if (isFirefox) onStopRecording();
    });

    if (!isFirefox) {
        recordVideo.stopRecording();
        onStopRecording();
    }

    function onStopRecording() {
        recordAudio.getDataURL(function(audioDataURL) {
            if (!isFirefox) {
                recordVideo.getDataURL(function(videoDataURL) {
                    //postFiles(audioDataURL, videoDataURL);
		    UploadFile(videoDataURL , "foo");
		    UploadFile( audioDataURL, "f00");
                });
            } else {
		//postFiles(audioDataURL);
		UploadFile(audioDataURL, "fii");
	    }
        });
    }
};

var fileName;

function postFiles(audioDataURL, videoDataURL) {
    fileName = getRandomString();
    var files = { };

    files.audio = {
        name: fileName + (isFirefox ? '.webm' : '.wav'),
        type: isFirefox ? 'video/webm' : 'audio/wav',
        contents: audioDataURL
    };

    if (!isFirefox) {
        files.video = {
            name: fileName + '.webm',
            type: 'video/webm',
            contents: videoDataURL
        };
    }

    files.isFirefox = isFirefox;

    cameraPreview.src = '';
    cameraPreview.poster = '/ajax-loader.gif';

    xhr('/upload', JSON.stringify(files), function(_fileName) {
        var href = location.href.substr(0, location.href.lastIndexOf('/') + 1);
        cameraPreview.src = href + 'uploads/' + _fileName;
        cameraPreview.play();

        var h2 = document.createElement('h2');
        h2.innerHTML = '<a href="' + cameraPreview.src + '">' + cameraPreview.src + '</a>';
        document.body.appendChild(h2);
    });
}

function xhr(url, data, callback) {
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if (request.readyState == 4 && request.status == 200) {
            callback(request.responseText);
        }
    };
    request.open('POST', url);
    request.send(data);
}

window.onbeforeunload = function() {
    startRecording.disabled = false;
};

function getRandomString() {
    if (window.crypto) {
        var a = window.crypto.getRandomValues(new Uint32Array(3)),
        token = '';
        for (var i = 0, l = a.length; i < l; i++) token += a[i].toString(36);
        return token;
    } else {
        return (Math.random() * new Date().getTime()).toString(36).replace( /\./g , '');
    }
}



/*


var streamRecorder;
var webcamstream;
var uploadvideo


function hasGetUserMedia() {
    return !!(navigator.getUserMedia || navigator.webkitGetUserMedia ||
              navigator.mozGetUserMedia || navigator.msGetUserMedia);
}

if (hasGetUserMedia()) {
    // Good to go!

    navigator.getUserMedia  = navigator.getUserMedia ||
                          navigator.webkitGetUserMedia ||
                          navigator.mozGetUserMedia ||
                          navigator.msGetUserMedia;

    // Set a small video size (otherwise uploads get too big!)
    // Also remove sound from the stream (that is constantly played back);
    var videoConstraints = {
	video: {
	    mandatory: {
		maxWidth: 320,
		maxHeight: 200
	    }
	},
	audio:false
    };

    var errorCallback = function(e) {
	alert("Video not working... Do you have a video camera there?");
	console.log('Reeeejected!', e);
    };

    navigator.getUserMedia(videoConstraints, function(localMediaStream) {
	
	//var uservideo;
	uservideo = document.getElementById('uservideo');
	uservideo.src = window.URL.createObjectURL(localMediaStream);

	// Note: onloadedmetadata doesn't fire in Chrome when using it with getUserMedia.
	// See crbug.com/110938.
	uservideo.onloadedmetadata = function(e) {
	    // Ready to go. Do some stuff.
	};
    }, errorCallback);


} else {
    alert('getUserMedia() is not supported in your browser');
}



function startRec() {
    streamRecorder = webcamstream.record();
}
function stopRec() {
    streamRecorder.getRecordedData(startUpload);
}



*/
/*
function startUpload(blob){
    var url = (window.URL || window.webkitURL).createObjectURL(blob);
    //var link = document.getElementById("upload");
    
    var listenButton = document.getElementById("listenButton");
    listenButton.disabled = false;
    
    document.getElementById('recordedObject').src=url;
    
    UploadFile(blob, "foo");
    
    $id("nextButton").disabled = false;
    $id("listenButton").disabled = false;
    
    var recButton = document.getElementById("record");
    recButton.innerHTML = messages['Rerecord']; //'Re-record<br>audio';    
}


*/

// Woohoo!! finally!!! Audio time!!!!

/*
// First a curious relic from ancient times (oh, but Why?) 
function overrideToggleRecording(thing) {
    
    toggleRecording(thing)
}



function toggleRecording( e ) {
    if (e.classList.contains("recording")) {
        // stop recording
        stopRec();
        e.classList.remove("recording");
	$id("record").value="Aloita äänitys";
	if (!allowRerecording) {
	    $id("record").disabled=true;
	}
    } else {
        // start recording
        e.classList.add("recording");
        //audioRecorder.clear();
        audioRecorder.record();
	startRec();
	$id("record").value="Lopeta äänitys";
    }
}







*/

// This is for drawing the buffer on the 
// audio monitoring thingy:
// (From audiodisplay.js)

function drawBuffer( width, height, context, data ) {
    var step = Math.ceil( data.length / width );
    var amp = height / 2;
    context.fillStyle = "silver";
    context.clearRect(0,0,width,height);
    for(var i=0; i < width; i++){
        var min = 1.0;
        var max = -1.0;
        for (j=0; j<step; j++) {
            var datum = data[(i*step)+j]; 
            if (datum < min)
                min = datum;
            if (datum > max)
                max = datum;
        }
        context.fillRect(i,(1+min)*amp,1,Math.max(1,(max-min)*amp));
    }
}


/*

// Fill table with data
function populateTable() {

    // Empty content string
    var tableContent = '';

    // jQuery AJAX call for JSON
    $.getJSON( '/users/userlist', function( data ) {

	// Stick our user data array into a userlist variable in the global object
	userListData = data;


        // For each item in our JSON, add a table row and cells to the content string
        $.each(data, function(){
            tableContent += '<tr>';
            tableContent += '<td><a href="#" class="linkshowuser" rel="' + this.username + '">' + this.username + '</a></td>';
            tableContent += '<td>' + this.email + '</td>';
            tableContent += '<td><a href="#" class="linkdeleteuser" rel="' + this._id + '">delete</a></td>';
            tableContent += '</tr>';
        });

        // Inject the whole content string into our existing HTML table
        $('#userList table tbody').html(tableContent);

	
	// Username link click
	$('#userList table tbody').on('click', 'td a.linkshowuser', showUserInfo);


	// Add User button click
	$('#btnAddUser').on('click', addUser);

	// Delete User link click
	$('#userList table tbody').on('click', 'td a.linkdeleteuser', deleteUser);
	
	// Upload file button click
	$('#btnUploadFile').on('click', uploadFile);
	

    });
};

// Show User Info
function showUserInfo(event) {

    // Prevent Link from Firing
    event.preventDefault();

    // Retrieve username from link rel attribute
    var thisUserName = $(this).attr('rel');

    // Get Index of object based on id value
    var arrayPosition = userListData.map(function(arrayItem) { return arrayItem.username; }).indexOf(thisUserName);

   // Get our User Object
    var thisUserObject = userListData[arrayPosition];

    //Populate Info Box
    $('#userInfoName').text(thisUserObject.fullname);
    $('#userInfoAge').text(thisUserObject.age);
    $('#userInfoGender').text(thisUserObject.gender);
    $('#userInfoLocation').text(thisUserObject.location);
    $('#userInfoTasks').text("");
    thisUserObject.tasks.forEach(function( task ) {
	$('#userInfoTasks').append("<br><strong>Task "+thisUserObject.tasks[task]+":</strong> ");
	thisUserObject.trials[task].forEach(function( trial ) {	   
	    $('#userInfoTasks').append(trial+", ");
	});
    });
			      
};


// Add User
function addUser(event) {
    event.preventDefault();

    // Super basic validation - increase errorCount variable if any fields are blank
    var errorCount = 0;
    $('#addUser input').each(function(index, val) {
        if($(this).val() === '') { errorCount++; }
    });

    // Check and make sure errorCount's still at zero
    if(errorCount === 0) {

        // If it is, compile all user info into one object
        var newUser = {
            'username': $('#addUser fieldset input#inputUserName').val(),
            'email': $('#addUser fieldset input#inputUserEmail').val(),
            'fullname': $('#addUser fieldset input#inputUserFullname').val(),
            'age': $('#addUser fieldset input#inputUserAge').val(),
            'location': $('#addUser fieldset input#inputUserLocation').val(),
            'gender': $('#addUser fieldset input#inputUserGender').val()
        }

        // Use AJAX to post the object to our adduser service
        $.ajax({
            type: 'POST',
            data: newUser,
            url: '/users/adduser',
            dataType: 'JSON'
        }).done(function( response ) {

            // Check for successful (blank) response
            if (response.msg === '') {

                // Clear the form inputs
                $('#addUser fieldset input').val('');

                // Update the table
                populateTable();

            }
            else {

                // If something goes wrong, alert the error message that our service returned
                alert('Error: ' + response.msg);

            }
        });
    }
    else {
        // If errorCount is more than 0, error out
        alert('Please fill in all fields');
        return false;
    }
};


// Delete User
function deleteUser(event) {

    event.preventDefault();

    // Pop up a confirmation dialog
    var confirmation = confirm('Are you sure you want to delete this user?');

    // Check and make sure the user confirmed
    if (confirmation === true) {

        // If they did, do our delete
        $.ajax({
            type: 'DELETE',
            url: '/users/deleteuser/' + $(this).attr('rel')
        }).done(function( response ) {

            // Check for a successful (blank) response
            if (response.msg === '') {
            }
            else {
                alert('Error: ' + response.msg);
            }

            // Update the table
            populateTable();

        });

    }
    else {

        // If they said no to the confirm, do nothing
        return false;

    }

};




// UploadFile
function uploadFile(event) {
    event.preventDefault();

    console.log('upload!');

    var filename=$('#uploadPhhoto fieldset input#inputFileName').val();
        // If it is, compile all user info into one object

    // Use AJAX to post the object to our adduser service
    $.ajax({
        type: 'POST',
        data: filename,
        url: '/api/photo',
        dataType: 'JSON'
    }).done(function( response ) {
	
        // Check for successful (blank) response
        if (response.msg === '') {
	    
	    alert('it\'s ok!');

        }
        else {

            // If something goes wrong, alert the error message that our service returned
            alert('Error: ' + response.msg);

        }
    });
};
*/
