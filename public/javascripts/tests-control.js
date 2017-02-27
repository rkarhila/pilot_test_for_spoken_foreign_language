

var test;
var testListData;
var stimulusdata;
var responsetime;
var controls;

var tasksdone = -1;
var oldlayout;

function showTrial( data ) {


    // Empty content string
    var testContent = '';
    
    // Stick our test data array into a testlist variable in the global object
    testListData = data;


    header = "<h4>Task "+ data.task_id +" trial "+ data.trial_id +"</h4>";

    if (data.stimulus_layout) {
	$('#taskarea').html( header+data.stimulus_layout);
	oldlayout=data.stimulus_layout;
    }
    else {
	//console.log("Using old layout!:");
	//console.log(oldlayout);
	$('#taskarea').html(header+oldlayout);
    }
    

    responsetime = data.response_time;
    controls=data.controls;

    // Important control logic:
    //nextUrl=data.next;
    nextUrl="";

    //console.log('This task: '+data.task_id+ '/'+data.trial_id+' Next task: '+nextUrl);

    /* Debug data */
    $('#testTask_id').text(data.task_id);
    $('#testTrial_id').text(data.trial_id);
    $('#testStimulus').text(data.stimulus);
    $('#testRespTime').text(responsetime);    
    $('#testNext').text(data.next);
        
    $('#taskCounter').text(++tasksdone+'/'+22);

    if (data.model_pronunciation) {
	console.log("I want to use "+data.model_pronunciation);
	$('#model_pronunciation').html("<audio src="+base_url+"/test_media/"+data.model_pronunciation+" id='model_pronunciation_audio' onended='startRecord()'>"  );
    }
    else {
	console.log("There is no model_pronunciation");
    }


    var buttontext_next = (data.buttontext_next || 'Next');
    var buttontext_start_rec = (data.buttontext_start_rec || 'Start recording');
    var buttontext_stop_rec = (data.buttontext_stop_rec || 'Stop recording');
    var buttontext_listen = (data.buttontext_listen || 'Listen');
    var buttontext_again = (data.buttontext_again || 'Try again');


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
	$('#controlarea').html('<input id="startRecording" type="button" value="'+buttontext_start_rec+'">');
	$('#startRecording').bind('click', startRecord);
	$('#startRecording').bind('touchend', startRecord);

	$('#controlarea').append('<input id="stopRecording" type="button"  value="'+buttontext_stop_rec+'" hidden>');
	$('#controlarea').append('<input id="listenButton" type="button"  value="'+buttontext_listen+'" name="listen" hidden><br>');
	$('#controlarea').append('<input id="againButton" type="button"  value="'+buttontext_again+'" name="next" hidden>');
	$('#controlarea').append('<input id="nextButton" type="button"  value="'+buttontext_next+'" name="next" hidden>');

	$('#nextButton').on('click', populateTest );
	$('#nextButton').on('touchend', populateTest );
	
	
	$('#againButton').bind('click', repopulateTest );
	$('#againButton').bind('touchend', repopulateTest );


	
	$('#stimulus').html(data.stimulus);

	$('#controlarea').append('<div id="timer"></div>');

    }
    else if (controls == "start_only_with_visible_stimulus") {

	/* Start only use case:

	   1. show prompt
              show [ Record ]-button  ---> 2. start Timer,         ---->  3. Automatically
                                              show [ stop ] button ---->     go to next task

	*/	

	$('#controlarea').html('<input id="startRecording" type="button" value="'+buttontext_start_rec+'">');	
	$('#startRecording').on('click', startRecord );
	$('#startRecording').on('touchend', startRecord );

	$('#stimulus').html(testListData.stimulus);

 	$('#controlarea').append('<input id="stopRecording" type="button"  value="'+buttontext_stop_rec+'" hidden>');
 	$('#controlarea').append('<input id="nextButton" type="button"  value='+buttontext_next+' name="next" hidden>');

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

	$('#controlarea').html('<input id="startRecording" type="button" value="'+buttontext_start_rec+'">');	

	if (test_type == 'standard') {
	    $('#startRecording').on('click', showPromptAndStartRecord );
	    $('#startRecording').on('touchend', showPromptAndStartRecord );
	}
	else {
	    $('#startRecording').on('click', ListenToSampleShowPromptAndStartRecord );
	    $('#startRecording').on('touchend', ListenToSampleShowPromptAndStartRecord );
	}

 	$('#controlarea').append('<input id="stopRecording" type="button"  value="'+buttontext_stop_rec+'" hidden>');
 	$('#controlarea').append('<input id="nextButton" type="button"  value='+buttontext_next+' name="next" hidden>');

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



	$('#controlarea').html('<input id="startRecording" type="button" value="Aloita videokeskustelu" hidden>');
	$('#startRecording').on('click', startVideoCircus );
	$('#startRecording').on('touchend', startVideoCircus );	    
	
 	$('#controlarea').append('<input id="stopRecording" type="button"  value="'+buttontext_stop_rec+'" hidden>');
	
	$('#controlarea').append('<div id="timer"></div>');
	continueVideoCircus();
	
    }
    else if ( controls == "sync_prepare_and_rec") {
	prepareSync();
    }
    else if (controls == "None" ) {
	$('#controlarea').html('');
    }
    else if (controls == "accept_only") {
	$('#stimulus').html( testListData.stimulus.replace(/\$username/, username));

	$('#controlarea').append('<input id="nextButton" type="button"  value="'+buttontext_next+'" name="next">');
	$('#nextButton').on('click', populateTest );
	$('#nextButton').on('touchend', populateTest );	



    }
    else if (controls == "feedback") {
	$('#controlarea').html("");
	$('#testwrapper').css('height','90%');
	$('#testarea').css('height','90%');
	$('#testarea').html("<iframe src=\""+base_url+"feedback\" width=100% height=100%>");
    }

    else if (controls == "wait_for_results") {
	$('#stimulus').html( testListData.stimulus.replace(/\$username/, username));
	$('#controlarea').html('<div id="timerarea"></div><div id="responsearea"></div>');
	checkRes();
    }
}

var checkRes = function() {
    $('#timerarea').html('<div id="timer"></div>')
    $(function() {
	$('#timer').pietimer({
	    timerSeconds: ( 5),
	    color: '#234',
	    fill: false,
	    showPercentage: false,
		showRemainingSecs: false,
	    callback: function() {
		checkRes();		
            }
	});
    });   

    $.ajax({
	type: 'GET',
	url:  base_url+'/u/'+username+'/checkresults',
        dataType: 'JSON'
    }).done(function( response ) {
	console.log(response);

	if (response.code === "101") {
	    window.location.href = base_url+'/u/'+username+'/results';
	}
	else if (response.code === "100") {
	    $('#responsearea').html(response.message);
	    setTimeout(5000, checkRes );
	}
    });
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
            timerSeconds: ( testListData.sync_interval || 5),
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




var filename_extra = 0;
var trialindex = -1;

if (typeof (start_trial) !== 'undefined') {
    trialindex = start_trial;
}

function populateTest( ) {
    //console.log('populating ' + nextUrl);
    
    // jQuery AJAX call for JSON
    filename_extra = 0;
    //$.getJSON( nextUrl, function( data ) {showTrial( data ) });
    //setTimeout(function(){
	showTrial( tasks_and_stimuli[++trialindex] );
    //}, 200);
}


function repopulateTest( ) {
    //console.log('populating ' + nextUrl);
    filename_extra += 1;
    showTrial( tasks_and_stimuli[trialindex] );
}


