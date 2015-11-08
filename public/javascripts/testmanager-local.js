// Userlist data array for filling in info box
var userListData = [];

var nextUrl= '/test/user/'+username+'/task/0/trial/0';
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
    populateTasks();
    $('#btnNext').on('click', populateTasks );
    $('#btnNext').on('touchend', populateTasks );

});

// Functions =============================================================




$(document).keypress(function(e){
    console.log("Key presssed: "+e.which);
    if (e.which == 144){
	populateTasks();
    }
});



// A little help from http://stackoverflow.com/questions/24816/escaping-html-strings-with-jquery
var entityMap = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': '&quot;',
    "'": '&#39;',
    "/": '&#x2F;'
};

function escapeHtml(string) {
    return String(string).replace(/[&<>"'\/]/g, function (s) {
	return entityMap[s];
    });
}




// A little helper used by the old scripts:
// getElementById
function $id(id) {
    return document.getElementById(id);
}

var taskList;
/*
var test;
var testListData;
var stimulusdata;
var responsetime;
var controls;
*/

function showTasks( tasks ) {

    taskList=tasks;
    // Empty content string
    var taskContent = '';

    $.each(tasks, function(task){
	taskContent +="<div class=task id=task"+ tasks[task].task_id +">";
	taskContent +="<div class=taskLabel> task_id </div><div class=taskSample>"+tasks[task].task_id+"</div>";
	taskContent +="<div class=taskLabel> evaluated </div><div class=taskSample> " + tasks[task].evaluated+"</div>";
	taskContent +="<div class=taskLabel> instructions </div><div class=taskSample>"+escapeHtml(tasks[task].instructions)+"</div>";
	taskContent +="<div class=taskLabel> stimulus_layout</div><div class=taskSample>"+escapeHtml(tasks[task].stimulus_layout)+"</div>";
	taskContent +="<div class=taskLabel> controls </div><div class=taskSample>"+escapeHtml(tasks[task].controls)+"</div>";

	taskContent +="<div class=taskLabel> trials </div><div class=trials>";
	console.log('Let\'s look at the trials of task '+tasks[task].task_id+':');
	console.log(tasks[task].trials);
	$.each(tasks[task].trials, function(trial_id){
	    var trial = tasks[task].trials[trial_id];
	    taskContent +="<div class=trial  id=task"+ tasks[task].task_id +"_trial"+trial.trial_id+">";	    
	    taskContent +="<div class=trialLabel> trial_id </div><div class=trialSample>"+trial.trial_id+"</div>";
	    taskContent +="<div class=trialLabel> stimulus </div><div class=trialSample>"+escapeHtml(trial.stimulus)+"</div>";
	    taskContent +="<div class=trialLabel> stimulus_2 </div><div class=trialSample>"+escapeHtml(trial.stimulus_2)+"</div>";
	    taskContent +="<div class=trialLabel> stimulus_3 </div><div class=trialSample>"+escapeHtml(trial.stimulus_3)+"</div>";
	    taskContent +="<div class=trialLabel> hypermedia </div><div class=trialSample>"+escapeHtml(trial.hypermedia)+"</div>";
	    taskContent +="<div class=trialLabel> response_time </div><div class=trialSample>"+escapeHtml(trial.response_time)+"</div>";
	    taskContent +="<div><input type=button value=Preview onClick='previewTrial("+tasks[task].task_id+","+trial.trial_id+")'></button></div>";
	    taskContent +="</div>"; //  /trial

	});
	taskContent +="</div>"; // /trials
	taskContent +="</div>"; // /task
    });

    $('#TaskList').html(taskContent);
}


function previewTrial(task_id, trial_id){

    console.log('Show '+task_id+', '+trial_id);
    var viewportOffset = document.getElementById('wrapper').getBoundingClientRect();
    // these are relative to the viewport
    var left = viewportOffset.left;
    var top = viewportOffset.top;

    console.log('moving to left: '+left+', top: '+top);

    $('#taskEditor').css('left',left);
    $('#taskEditor').css('top',-top);
    



    $('#EditTaskId').text( task_id );
    $('#EditTaskEvaluated').text( taskList[task_id].evaluated );
    $('#EditTaskInstructions').html( taskList[task_id].instructions );
    $('#EditTaskControls').text( taskList[task_id].controls );
    $('#EditTrialId').text( taskList[task_id].trials[trial_id].trial_id );
    $('#EditTrialHypermedia').text( taskList[task_id].trials[trial_id].hypermedia );
    $('#EditTrialMediaType').text( taskList[task_id].trials[trial_id].mediatype );
    $('#EditTrialStimulus').html( taskList[task_id].stimulus_layout);
    $('#stimulus').html( taskList[task_id].trials[trial_id].stimulus );
    if (taskList[task_id].controls == "feedback") {
	$('#stimulus').html("<iframe src=\""+base_url+"feedback\" width=100% height=100%>");
    } else {
	console.log(taskList[task_id]);
    }
    $('#EditTrialResponseTime').text( taskList[task_id].trials[trial_id].response_time );
    

    if ( taskList[task_id].trials[trial_id].mediatype == "video") {
	console.log("It should be an image!");
	$('#stimulusmedia').html("<video id=editTrialVideo src=\""+base_url+taskList[task_id].trials[trial_id].hypermedia+"\" controls>");
    }
    
    else if ( taskList[task_id].trials[trial_id].mediatype == "image") {
	$('#stimulusmedia').html("<img src=\""+base_url+taskList[task_id].trials[trial_id].hypermedia+"\">");
    }

    if ( typeof(taskList[task_id].trials[trial_id].stimulus_2) !== 'undefined') {
	console.log('another stim!');
	$('#EditTrialNextStim').html("<input type=button value=Next onClick='nextPreviewStimulus("+taskList[task_id].task_id+","+trial_id+",2)'></button></div>");
    }

    

}

function nextPreviewStimulus(task_id, trial_id, stimulus_id){
    
    $('#stimulus').html( taskList[task_id].trials[trial_id]['stimulus_'+stimulus_id] );
    
    if ( typeof(taskList[task_id].trials[trial_id]['stimulus_'+(parseInt(stimulus_id)+1)]) !== 'undefined') {
	$('#EditTrialNextStim').html="<input type=button value=Next onClick='nextPreviewStimulus("+tasks[task].task_id+","+trial.trial_id+","+(parseInt(stimulus_id)+1)+")'></button></div>";
    }    
    else {
	$('#EditTrialNextStim').text("");
    }   
}


var filename_extra = 0;

function populateTasks( ) {
    //console.log('populating ' + nextUrl);
    
    // jQuery AJAX call for JSON
    filename_extra = 0;
    $.getJSON( base_url+'/tasks/all', function( data ) {showTasks ( data ) });
}


function repopulateTasks( ) {
    filename_extra += 1;
    showTrial( testListData );
}


