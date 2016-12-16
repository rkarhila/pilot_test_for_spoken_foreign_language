// Userlist data array for filling in info box
var userListData = [];

var nextUrl= base_url+'/test/user/'+username+'/task/0/trial/0';
var maxrectime = 5;
var allowRerecording = false;

var uservideo;
var globalmediastream;

var videomaxwidth = 200;
var videomaxheight = 150;


var messagelist = {
    fi_fi: {
	uploading : "Lähetetään "
    },
    en_uk: {
	uploading : "Uploading "
    }
}




// DOM Ready =============================================================
$(document).ready(function() {

    // Populate the user table on initial page load
    // populateTest();
    // initView();
    //$('#instructions').html("These are your instructions!");

    $('#controlarea').append('<input id="nextButton" type="button"  value="Seuraava" name="next">');

    $('#nextButton').on('click', populateTest );
    $('#nextButton').on('touchend', populateTest );

    $('#main').css('height', Math.max($( document ).height(), $(window).height()) +'px');

});

// Functions =============================================================



/*
$(document).keypress(function(e){
    console.log("Key presssed: "+e.which);
    if (e.which == 110){
	populateTest();
    }
});
*/

// From a stackoverflow link I've lost now:

function onElementHeightChange(elm, callback){
    var lastHeight = elm.clientHeight, newHeight;
    (function run(){
        newHeight = elm.clientHeight;
        if( lastHeight != newHeight )
            callback();
        lastHeight = newHeight;

        if( elm.onElementHeightChangeTimer )
            clearTimeout(elm.onElementHeightChangeTimer);

        elm.onElementHeightChangeTimer = setTimeout(run, 200);
    })();
}


$( window ).resize( function() {
    console.log("__1__ Changing doc height to  either " + $( document ).height() + " or "+ $(window).height() +'px')
    $('#main').css('height', Math.max($( document ).height(), $(window).height()) +'px'); 
});

onElementHeightChange(document.body, function(){
    console.log("__1__ Changing doc height to  either " + $( document ).height() + " or "+ $(window).height() +'px')
    $('#main').css('height', Math.max($( document ).height(), $(window).height()) +'px');
});





// A little helper used by the old scripts:
// getElementById
function $id(id) {
    return document.getElementById(id);
}



function initView() {
    $('#instructions').html("Tervetuloa tekemään puhutun kielen koepilottia! ");
}


var test;
var testListData;
var stimulusdata;
var responsetime;
var controls;

var tasksdone = -1;

function showTrial( data ) {
    var swedometer="";
 
    data.all_tests.forEach(function (item) {	
	//swedometer+= "<div "+item.length+" style='min-width:"+((item.length/data.total_length*93))+"%;' class="+item.style+">"+item.task_id+"."+item.trial_id+"</div>";
	swedometer+= "<div "+item.length+" style='min-width:25px' class="+item.style+">"+item.task_id+"."+item.trial_id+"</div>";
    });
    swedometer += "</tr></table>";
    $('#swedometer').html(swedometer);

    // Empty content string
    var testContent = '';
    
    // Stick our test data array into a testlist variable in the global object
    testListData = data;

    $('#instructions').html(data.instructions + '<a href="#main" class="allClear">Tämä selvä!</a>');


    $('#taskarea').html( data.stimulus_layout);

    responsetime = data.trial.response_time;
    controls=data.controls;

    // Important control logic:
    nextUrl=data.next;


    console.log('This task: '+data.task_id+ '/'+data.trial.trial_id+' Next task: '+nextUrl);

    /* Debug data */
    $('#testTask_id').text(data.task_id);
    $('#testInstructions').text(data.instructions);
    $('#testStimulus_layout').text(data.stimulus_layout);    
    $('#testTrial_id').text(data.trial.trial_id);
    $('#testStimulus').text(data.trial.stimulus);
    $('#testRespTime').text(responsetime);    
    $('#testNext').text(data.next);
        
    $('#taskCounter').text(++tasksdone+'/'+22);
    

    if (data.showinstructions == "1") {
	// From http://stackoverflow.com/questions/13735912/anchor-jumping-by-using-javascript
	var url = location.href;               //Save down the URL without hash.
	location.href = "#instructions";       //Go to the target element.
	history.replaceState(null,null,url);   //Don't like hashes. Changing it back.
    }


    if (controls == "full" || controls == "full_forced_listening") {
	/* Full controls use case:

	   1. show [ Record ]-button  --->  2. show prompt  
                                               start Timer          ---->  3. show 
                                               show [ stop ] button ---->  3. [ Listen ], [ next ]  and [ redo ] buttons
                                                                                             |              |
                                                                                             V              V
                                                                                         next task      go to 1


	   Full controls with forced listen use case:

	   1. show [ Record ]-button  --->  2. show prompt  
                                               start Timer          ---->  3. show 
                                               show [ stop ] button ---->  3. [ Listen ] -button
                                                                                 |
                                                                                 |
                                                                                 V
                                                                                 4.  show  [ next ]  and [ redo ] buttons
                                                                                             |              |
                                                                                             V              V
                                                                                         next task      go to 1

	*/
	$('#controlarea').html('<input id="startRecording" type="button" value="Aloita nauhoitus">');
	$('#startRecording').bind('click', startRecord);
	$('#startRecording').bind('touchend', startRecord);

	$('#controlarea').append('<input id="stopRecording" type="button"  value="Lopeta nauhoitus" hidden>');
	$('#controlarea').append('<input id="listenButton" type="button"  value="Kuuntele" name="listen" hidden><br>');
	$('#controlarea').append('<input id="againButton" type="button"  value="Uudestaan" name="next" hidden>');
	$('#controlarea').append('<input id="nextButton" type="button"  value="Seuraava" name="next" hidden>');

	$('#nextButton').on('click', populateTest );
	$('#nextButton').on('touchend', populateTest );
	
	
	$('#againButton').bind('click', repopulateTest );
	$('#againButton').bind('touchend', repopulateTest );


	
	$('#stimulus').html(data.trial.stimulus);

	$('#controlarea').append('<div id="timer"></div>');

    }
    else if (controls == "start_only_with_visible_stimulus") {

	/* Start only use case:

	   1. show prompt
              show [ Record ]-button  ---> 2. start Timer,         ---->  3. Automatically
                                              show [ stop ] button ---->     go to next task

	*/	

	$('#controlarea').html('<input id="startRecording" type="button" value="Aloita nauhoitus">');	
	$('#startRecording').on('click', startRecord );
	$('#startRecording').on('touchend', startRecord );

	$('#stimulus').html(testListData.trial.stimulus);

 	$('#controlarea').append('<input id="stopRecording" type="button"  value="Lopeta nauhoitus" hidden>');
 	$('#controlarea').append('<input id="nextButton" type="button"  value="Seuraava" name="next" hidden>');

	$('#nextButton').on('click', populateTest );	
	$('#nextButton').on('touchend', populateTest );	

	$('#controlarea').append('<div id="timer"></div>');
    }
    else if (controls == "start_only") {

	/* Start only use case:

	   1. show [ Record ]-button  ---> 2. show prompt,
	                                      start Timer,         ---->  3. Automatically
                                              show [ stop ] button ---->     go to next task

	*/	

	$('#controlarea').html('<input id="startRecording" type="button" value="Aloita nauhoitus">');	
	$('#startRecording').on('click', showPromptAndStartRecord );
	$('#startRecording').on('touchend', showPromptAndStartRecord );

 	$('#controlarea').append('<input id="stopRecording" type="button"  value="Lopeta nauhoitus" hidden>');
 	$('#controlarea').append('<input id="nextButton" type="button"  value="Seuraava" name="next" hidden>');

	$('#nextButton').on('click', populateTest );	
	$('#nextButton').on('touchend', populateTest );	

	$('#controlarea').append('<div id="timer"></div>');
    }
    else if (controls == "forced_play") {
	
	/* Forced play use case:

	   0. Close instuctions  ----->   1. play video 
                                               |
                                               |
                                               V
	                                  2.  start Timer,         ---->  3. Automatically
                                              show [ stop ] button ---->     go to next task

	*/


	if (data.showinstructions == "1") {
	    $('#controlarea').html('<input id="startRecording" type="button" value="Aloita videokeskustelu">');	
	    $('#startRecording').on('click', startVideoCircus );
	    $('#startRecording').on('touchend', startVideoCircus );
	    
 	    $('#controlarea').append('<input id="stopRecording" type="button"  value="Lopeta nauhoitus" hidden>');
	    $('#controlarea').append('<div id="timer"></div>');
	}
	else {
	    $('#controlarea').html('<input id="startRecording" type="button" value="Aloita videokeskustelu" hidden>');
	    $('#startRecording').on('click', startVideoCircus );
	    $('#startRecording').on('touchend', startVideoCircus );	    
	
 	    $('#controlarea').append('<input id="stopRecording" type="button"  value="Lopeta nauhoitus" hidden>');

	    $('#controlarea').append('<div id="timer"></div>');
	    continueVideoCircus();
	}
	
    }
    else if ( controls == "sync_prepare_and_rec") {
	prepareSync();
    }
    else if (controls == "None" ) {
	$('#controlarea').html('');
    }
    else if (controls == "feedback") {
	$('#controlarea').html("");
	$('#testwrapper').css('height','90%');
	$('#testarea').css('height','90%');
	$('#testarea').html("<iframe src=\""+base_url+"feedback\" width=100% height=100%>");
    }

}

function prepareSync() {
	$('#stimulus').html(testListData.trial.stimulus);
	$('#controlarea').html('<input id="syncName" type="text" placeholder="Kaverisi tunnus">')
	$('#controlarea').append('<input id="syncButton" type="button" value="Synkronoi">');

	$('#syncButton').on('click', startSync );
	$('#syncButton').on('touchend', startSync );
}


var targetUser;

function startSync() {

    if (typeof($('#syncName')).val() !== 'undefined' ) {
	targetUser = $('#syncName').val();
    }

    $('#controlarea').html('<p>Synkronoidaan käyttäjän "'+targetUser+'" kanssa');
    $('#controlarea').append('<input id="syncCancelButton" type="button" value="Peruuta">');
    $('#syncCancelButton').on('click', cancelSync );
    $('#syncCancelButton').on('touchend', cancelSync );  

    $('#controlarea').append('<div id="timer"></div>');
    $(function() {
	$('#timer').pietimer({
            timerSeconds: ( testListData.trial.sync_interval || 5),
            color: '#234',
            fill: false,
            showPercentage: false,
	    showRemainingSecs: false,
            callback: function() {
		startSync();		
            }
	});
    });   

    $.ajax({
        type: 'GET',
        url:  base_url+'/sync/'+username+'/'+targetUser,
        dataType: 'JSON'
    }).done(function( response ) {
	if (response.code === "101") {
	    finishSync();
	}
	else if (response.code === "100") {
	    $('#syncCancelButton').disabled = true;
	    console.log('finishsync in ' + (parseInt(response.nextcheck)/1000)+ ' s');
	    setTimeout(finishSync, parseInt(response.nextcheck));
	}
	console.log(response);
    });
}


function cancelSync() {
    $('#timer').pietimer('reset');
    $.ajax({
        type: 'GET',
        url:  base_url+'/sync/cancel',
        dataType: 'JSON'
    }).done(function( response ) {
	console.log(response);
    });  
    prepareSync();
}


function finishSync(waitingTime) {
    $('#timer').pietimer('reset');

    $('#stimulus').html(testListData.trial.stimulus_2);

    $('#controlarea').html('<p><i>Valmistautukaa keskustelemaan!</i> <div id="timer"></div>');

    $('#timer').pietimer({
        timerSeconds: ( testListData.trial.preparation_time || 100),
        color: '#234',
        fill: false,
        showPercentage: false,
	showRemainingSecs: false,
        callback: function() {
	    console.log('Timer ready!');	    
	    startSyncRec();		
        }
    });

}

function startSyncRec() {
    $('#timer').pietimer('reset');
    $('#controlarea').html('<input id="startRecording" type="button" value="Aloita nauhoitus" hidden>');
    //$('#startRecording').bind('click', startRecord);
    //$('#startRecording').bind('touchend', startRecord);

    $('#controlarea').html('<input id="nextButton" type="button"  value="Seuraava" name="next" hidden>');
    $('#controlarea').append('<input id="stopRecording" type="button"  value="Lopeta nauhoitus" hidden>');    

    $('#nextButton').on('click', populateTest );	
    $('#nextButton').on('touchend', populateTest );	
    $('#controlarea').append('<p id="recordingWarningText"><i>Nauhoitus päällä! Keskustelkaa!</i> <div id="timer"></div>');
    startRecord();
}




var filename_extra = 0;

function populateTest( ) {
    //console.log('populating ' + nextUrl);
    
    // jQuery AJAX call for JSON
    filename_extra = 0;
    $.getJSON( nextUrl, function( data ) {showTrial( data ) });
}


function repopulateTest( ) {
    filename_extra += 1;
    showTrial( testListData );
}





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
var recordAudio, recordVideo;

/*
function bindControls () {

    cameraPreview = document.getElementById('camera-preview');
    listenButton = document.getElementById('listenbutton');

// value="Kuuntele" name="listen" disabled');

    audio = document.querySelector('audio');

    isFirefox = !!navigator.mozGetUserMedia;

    $('#startRecording').bind('onclick', startRecording());
}
*/




function playRecording () {
    console.log('Playing sample');
    document.getElementById('recordedObject').play();
    if (controls == "full_forced_listening" ) {
	document.getElementById('recordedObject').addEventListener('ended', activateNext());
	$('#stimulus').html(testListData.trial.stimulus_2);
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
    $('#stimulus').html(testListData.trial.stimulus);

    // MEDIA
    if (testListData.trial.hypermedia !== 'None') {
	if (testListData.trial.mediatype == "video") {
	    console.log("It should be an image!");
	    $('#stimulusmedia').html("<video src=\""+base_url+testListData.trial.hypermedia+"\" autoplay onended='startRecord()'>");
	}
	else {
	    alert("Video not specified!");
	}
    }

}

function continueVideoCircus() {
    $('#stimulus').html(testListData.trial.stimulus);

    // MEDIA
    if (testListData.trial.hypermedia !== 'None') {
	if (testListData.trial.mediatype == "video") {
	    console.log("It should be an image!");
	    $('#stimulusmedia').html("<video src=\""+base_url+testListData.trial.hypermedia+"\" autoplay onended='startRecord()'>");
	}
	else {
	    alert("Video not specified!");
	}
    }
}



function showPromptAndStartRecord() {
    $('#stimulus').html(testListData.trial.stimulus);

    // MEDIA
    if (testListData.trial.hypermedia !== 'None') {
	console.log("some media 2? "+ testListData.trial.mediatype);
	if (testListData.trial.mediatype == "image") {
	    console.log("It should be an image!");
	    $('#stimulusmedia').html("<img src=\""+base_url+testListData.trial.hypermedia+"\" onload='startRecord();'>");
	}
    }
    // Moved this to onload-tag of the image, let's see if it works:
    else {
     startRecord();
    }
}


var uploadurl;

function startRecord() {

    uploadurl=base_url+'/upload/'+ username+'/'+(testListData.task_id)+'/'+(testListData.trial.trial_id);

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

    navigator.getUserMedia( mediaparam, function(stream) {

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
	
        if (!isFirefox && !noVideo) {
	    recordVideo.startRecording();
        }

	console.log('Trying to activate stop button');
        $('#stopRecording').attr("hidden", false);
	$('#stopRecording').bind('click', stopRecording);
	$('#stopRecording').bind('touchend', stopRecording);

	console.log('Done trying to activate stop button');



    }, function(error) {
        alert(JSON.stringify(error));
    });

    function stopRecording() {
	$('#timer').pietimer('reset');

	console.log('stopRecording invoked!');
	$('#startRecording').attr("disabled", false);
	$('#stopRecording').attr("disabled", true);


	recordAudio.stopRecording(function() {
            if (isFirefox) onStopRecording();
	});

	if (!isFirefox) {
            recordVideo.stopRecording();
            onStopRecording();
	}




	function onStopRecording() {
            recordAudio.getDataURL(function(audioDataURL) {

		document.getElementById('recordedObject').src=audioDataURL;		

		if (noVideo) {
		    postFiles(audioDataURL);
		}
		//else if (!isFirefox) {
		//    console.log("Getting data urls for video (not firefox)");
                //    recordVideo.getDataURL(function(videoDataURL) {
		//	postFiles(audioDataURL, videoDataURL);
			//UploadFile(cameraPreview.src, "foo");
			//UploadFile(audioDataURL, "foo1");
			//UploadFile(videoDataURL, "foo2");
			
		//    });
		//} else {
		    postFiles(audioDataURL);
		    //postFiles(recordRTC.getBlob());
		//}

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

'/test/user/'+username+'/task/0/trial/0';

function postFiles(audioDataURL, videoDataURL) {
    //fileName = getRandomString();
    fileName = username + '_' + (testListData.task_id) + '_' + (testListData.trial.trial_id);

    if (filename_extra > 0) {
	fileName += '_'+filename_extra;
    }

    var files = { };

    if (noVideo) {
	files.audio = {
            name: fileName + '.wav',
            type: 'audio/wav',
            contents: audioDataURL
	};	
    }
    else {
	//files.audio = {
	files.video = {
            //name: fileName + (isFirefox ? '.webm' : '.wav'),
	    name: fileName + '.webm',
            //type: isFirefox ? 'video/webm' : 'audio/wav',
	    type: 'video/webm',
            contents: audioDataURL
	};	
	//if (!isFirefox) {
        //    files.video = {
	//	name: fileName + '.webm',
	//	type: 'video/webm',
	//	contents: videoDataURL
        //    };
	//}
    }

    files.isFirefox = isFirefox;

    if (noVideo) {
	console.log("typeof files.audio.contents: "+typeof(files.audio.contents))
	console.log("File length: " + (files.audio.contents).length);	
    }
    else {
	console.log("typeof files.video.contents: "+typeof(files.video.contents))
	console.log("File length: " + (files.video.contents).length);
    }
    if (!isFirefox) {	
	UploadFile( JSON.stringify(files), fileName+'.*', uploadurl );
    } 
    else {
	UploadFile( JSON.stringify(files), fileName+'.*', uploadurl );
    }

}

function xhr(url, data, callback) {

    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if (request.readyState == 4 && request.status == 200) {
            callback(request.responseText);
        }
    };
    request.open('POST', url, true);
    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
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




// Once more around the sun: 
// Getting clients to sync for a pair task.

