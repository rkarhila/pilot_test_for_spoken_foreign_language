// Userlist data array for filling in info box
var userListData = [];

// DOM Ready =============================================================
$(document).ready(function() {

    // Populate the user table on initial page load
    populateTable();

});

// Functions =============================================================

var adminListData;

// Fill table with data
function populateTable() {

    // Empty content string
    var tableContent = '';

    // jQuery AJAX call for JSON
    $.getJSON( base_url+'/users/userlist/admins', function( adminData ) {

	// Stick our user data array into a userlist variable in the global object
	adminListData = adminData;

        var aTableContent = "";
        // For each item in our JSON, add a table row and cells to the content string
        $.each(adminData, function(){
            aTableContent += '<tr>';
            aTableContent += '<td><a href="#" class="linkshowuser" rel="' + this.username + '">' + this.username + '</a></td>';
            aTableContent += '<td>' + this.fullname + '</td>';
            aTableContent += '<td>' + this.role + '</td>';
            aTableContent += '<td>' +this.school+'</td>';
            //aTableContent += '<td>' + this.email + '</td>';
            //aTableContent += '<td>' + this.phone + '</td>';
            //aTableContent += '<td><a href="#" class="linkdeleteuser" rel="' + this._id + '">delete</a></td>';
            aTableContent += '</tr>';
        });

        // Inject the whole content string into our existing HTML table
        $('#adminList table tbody').html(aTableContent);


	// Username link click
	$('#adminList table tbody').on('click', 'td a.linkshowuser', showAdminInfo);


	// Add User button click
	$('#btnAddLocalAdmin').unbind();
	$('#btnAddLocalAdmin').on('click', addLocalAdmin);

	// Delete User link click
	//$('#adminList table tbody').on('click', 'td a.linkdeleteuser', deleteUser);


    });

    $.getJSON(  base_url+'/users/userlist/teachers', function( teacherData ) {

	// Stick our user data array into a userlist variable in the global object
	teacherListData = teacherData;

        var tTableContent="";

        // For each item in our JSON, add a table row and cells to the content string
        $.each(teacherData, function(){
            tTableContent += '<tr>';
            tTableContent += '<td><a href="#" class="linkshowuser" rel="' + this.username + '">' + this.username + '</a></td>';
            tTableContent += '<td>' + this.fullname + '</td>';
            tTableContent += '<td>' + this.role + '</td>';
            tTableContent += '<td>' + this.school + '</td>';
            tTableContent += '<td><a href="#" class="linkdeleteuser" rel="' + this._id + '">delete</a></td>';
            tTableContent += '</tr>';
        });

        // Inject the whole content string into our existing HTML table
        $('#teacherList table tbody').html(tTableContent);

	// Release old bindings:
	$('#teacherList table tbody').unbind();
	$('#btnAddTeacher').unbind();

	// Username link click
	$('#teacherList table tbody').on('click', 'td a.linkshowuser', showTeacherInfo);


	// Add User button click
	$('#btnAddTeacher').on('click', addTeacher);

	if (userrole==='global-admin') {
	    // Delete User link click
	    $('#teacherList table tbody').on('click', 'td a.linkdeleteuser', deleteUser);
	}

    });

    $.getJSON(  base_url+'/users/userlist/users', function( data ) {

	// Stick our user data array into a userlist variable in the global object
	userListData = data;

        var tableContent="";
        // For each item in our JSON, add a table row and cells to the content string
        $.each(data, function(){
            tableContent += '<tr>';
            tableContent += '<td><a href="#" class="linkshowuser" rel="' + this.username + '">' + this.username + '</a></td>';
            tableContent += '<td>' + this.password + '</td>';
            tableContent += '<td>' + this.school + '</td>';
            tableContent += '<td>' + this.teacher + '</td>';
            tableContent += '<td>' + this.yearclass + '</td>';
            tableContent += '<td>' + this.languageclass + '</td>';
            tableContent += '<td>' + (this.testversion || "2") + '</td>';
            tableContent += '<td>' + this.testcount + '</td>';

	    // My god this is getting too complicated: A teacher making reviews should not see
	    // other teacher's grades, but the admins need to see both the grades and who have given
	    // them:

	    if (userrole=='teacher') {

		tableContent +='<td>';
		$.each(this.evaluations, function () {
		    if (typeof( this.phonetic[username]) !== 'undefined') {
			tableContent += this.phonetic[username].score + "&nbsp;";
		    }
		});
		tableContent +='</td>';
	
		tableContent +='<td>';
		$.each(this.evaluations, function () {
		    if (typeof( this.fluency[username]) !== 'undefined') {
			tableContent += this.fluency[username].score + "&nbsp;";
		    }
		});
		tableContent +='</td>';

	    } 
	    else {
		// Goddam the specs changing just after I finished this!
		// Now some cumbersome kludging to save the day:

		// Make a dict of all evaluators who have evaluated this speaker:
		phone_evaluators={};
		flue_evaluators={};

		// Go thtough the evaluation JSON:
		$.each(this.evaluations, function() {
		    $.each(this.phonetic, function() {
			if (typeof(phone_evaluators[this.evaluated_by]) === 'undefined') {
			    phone_evaluators[this.evaluated_by] = { 'evaluated_by': this.evaluated_by,
								    'scores' : '' };
			}
			phone_evaluators[this.evaluated_by]['scores']+=this.score+'&nbsp;';
		    });
		       
		    $.each(this.fluency, function() {
			if (typeof(flue_evaluators[this.evaluated_by]) === 'undefined') {
			    flue_evaluators[this.evaluated_by] = { 'evaluated_by': this.evaluated_by,
								   'scores' : '' };
			}
			flue_evaluators[this.evaluated_by]['scores']+=this.score+'&nbsp;';
		    });
		});
		
		tableContent +='<td>';
		$.each(phone_evaluators, function() {
		    tableContent += this.evaluated_by+': '+this.scores +"<br>";
		});
		tableContent +='</td>';
		
		tableContent +='<td>';		
		$.each(flue_evaluators, function() {
		    tableContent += this.evaluated_by+': '+this.scores +"<br>";
		});
		tableContent +='</td>';
		


	    }
	    

            tableContent += '<td><a href="#" class="linkdeleteuser" rel="' + this._id + '">delete</a></td>';
            tableContent += '</tr>';
        });

        // Inject the whole content string into our existing HTML table
        $('#userList table tbody').html(tableContent);

	// Release old bindings:
	$('#userList table tbody').unbind();
	$('#btnAddStudent').unbind();


	// Username link click
	$('#userList table tbody').on('click', 'td a.linkshowuser', showUserInfo);

	// Add User button click
	$('#btnAddStudent').on('click', addStudent);

	// Delete User link click
	$('#userList table tbody').on('click', 'td a.linkdeleteuser', deleteUser);


    });



};

// Show User Info
function showAdminInfo(event) {

    // Prevent Link from Firing
    event.preventDefault();

    // Retrieve username from link rel attribute
    var thisUserName = $(this).attr('rel');

    // Get Index of object based on id value
    var arrayPosition = adminListData.map(function(arrayItem) { return arrayItem.username; }).indexOf(thisUserName);

   // Get our User Object
    var thisUserObject = adminListData[arrayPosition];

    //Populate Info Box
    $('#userInfoName').text(thisUserObject.fullname);
    $('#userInfoRole').text(thisUserObject.role);
    $('#userInfoSchool').text(thisUserObject.school);
    $('#userInfoEmail').text(thisUserObject.email);
    $('#userInfoPhone').text(thisUserObject.phone);

};
// Show User Info
function showTeacherInfo(event) {

    // Prevent Link from Firing
    event.preventDefault();

    // Retrieve username from link rel attribute
    var thisUserName = $(this).attr('rel');

    // Get Index of object based on id value
    var arrayPosition = teacherListData.map(function(arrayItem) { return arrayItem.username; }).indexOf(thisUserName);

   // Get our User Object
    var thisUserObject = teacherListData[arrayPosition];

    //Populate Info Box
    $('#userInfoName').text(thisUserObject.fullname);
    $('#userInfoSchool').text(thisUserObject.school);
    $('#userInfoRole').text(thisUserObject.role);
    $('#userInfoEmail').text(thisUserObject.email);
    $('#userInfoPhone').text(thisUserObject.phone);
    $('#userInfoTasks').text("");
    thisUserObject.tasks.forEach(function( task ) {
	$('#userInfoTasks').append("<br><strong>Task "+thisUserObject.tasks[task]+":</strong> ");
	thisUserObject.trials[task].forEach(function( trial ) {
	    $('#userInfoTasks').append(trial+", ");
	});
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
    $('#userInfoName').text(thisUserObject.username);
    $('#userInfoSchool').text(thisUserObject.school);
    $('#userInfoRole').text(thisUserObject.role);
    $('#userInfoTeacher').text(thisUserObject.teacher);
    $('#userInfoYearClass').text(thisUserObject.yearclass);
    $('#userInfoEmail').text("-");
    $('#userInfoPhone').text("-");
    $('#userInfoTasks').text("");

    // If current teacher user has not evaluated the evaluee, then the default 
    // value is set to '-'


    thisUserObject.tasks.forEach(function( task ) {
	$('#userInfoTasks').append("<br><strong>Task "+thisUserObject.tasks[task]+":</strong><br> ");
	if (typeof(thisUserObject.trials[task]) !== 'undefined') {
	    thisUserObject.trials[task].forEach(function( trial ) {
		if (thisUserObject.testsdone[task][trial]) {
		    $('#userInfoTasks').append('<video src='+base_url+'/answers/video/'+thisUserObject.testsdone[task][trial]+' controls>');
		}
		else {
		    $('#userInfoTasks').append("("+trial+")");
		}
	    });


	    if (userrole === 'teacher' && parseInt(task) > 1) {
		
		if (typeof( thisUserObject.evaluations[parseInt(task)].phonetic[username]) === 'undefined') {
		    defaultPhonetic='-';
		}
		else {
		    defaultPhonetic=thisUserObject.evaluations[parseInt(task)].phonetic[username].score;
		}
		if (typeof(thisUserObject.evaluations[parseInt(task)].fluency[username]) === 'undefined') {
		    defaultFluency='-';
		}
		else {
		    defaultFluency=thisUserObject.evaluations[parseInt(task)].fluency[username].score;
		}

		$('#userInfoTasks').append('<br><span id=userInfoPhoneticScore'+parseInt(thisUserObject.tasks[task])+'>'+getDropMenu("phonetic", defaultPhonetic, thisUserObject.tasks[task])+'</span>');

		$('#phonetic_dropdown'+parseInt(thisUserObject.tasks[task])).click(function(){sendScore("phonetic",thisUserObject.username, thisUserObject.tasks[task] )});


		$('#userInfoTasks').append('<br><span id=userInfoFluencyScore'+parseInt(thisUserObject.tasks[task])+'>'+getDropMenu("fluency", defaultFluency, thisUserObject.tasks[task])+'</span>');

		$('#fluency_dropdown'+parseInt(thisUserObject.tasks[task])).click(function(){sendScore("fluency",thisUserObject.username, thisUserObject.tasks[task] )});

		//$('#userInfoFluencyScore').html(getDropMenu("fluency", defaultFluency));
		//$('#fluency_dropdown').click(function(){sendScore("fluency", thisUserObject.username )});

	    } 
	    /*else {
		var all_eval = '';
		$.each(thisUserObject.evaluations.phonetic, function() {
		    all_eval += this.evaluated_by + ": " + this.score + " ";
		});
		$('#userInfoPhoneticScore').html(all_eval);
		var all_eval = '';

		$.each(thisUserObject.evaluations.fluency, function() {
		    all_eval += this.evaluated_by + ": " + this.score +" ";
		});
		$('#userInfoFluencyScore').html(all_eval);
	    	
	    }*/
	    





	}
    });

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
            url:  base_url+'/users/deleteuser/' + $(this).attr('rel')
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
        url:  base_url+'/api/photo',
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



// Add User
function addStudent(event) {
    event.preventDefault();

    // Super basic validation - increase errorCount variable if any fields are blank
    var errorCount = 0;
    $('#addStudent input').each(function(index, val) {
        if($(this).val() === '') { errorCount++; }
    });

    // Check and make sure errorCount's still at zero
    if(errorCount === 0) {

        // If it is, compile all user info into one object
        var newUser = {
            'teacher': $('#addStudent fieldset input#inputStudentsTeacher').val(),
            'school': $('#addStudent fieldset input#inputStudentSchool').val(),
            'yearclass': $('#addStudent fieldset select#inputStudentClass').val(),
            'languageclass': $('#addStudent fieldset select#inputStudentLangGroup').val(),
	    'addlist': $('#addStudent fieldset textarea#inputStudentList').val(),
        };

        // Use AJAX to post the object to our adduser service
        $.ajax({
            type: 'POST',
            data: newUser,
            url:  base_url+'/users/adduser/user',
            dataType: 'JSON'
        }).done(function( response ) {

            // Check for successful (blank) response
            if (response.msg === '') {
		var namelist='';
		$.each(response.userlist, function(key,val) {
		    console.log(key);
		    console.log(val);
		    namelist+= key+'\t'+val+'\n';
		});
		if (namelist.length > 0) {
		    $('#newNameList').html("Kopioi tästä lista uusista käyttäjistä ennen kuin nimet häviävät bittiavaruuden aurinkotuuleen: <pre>\n"+namelist+"</pre>");
		}
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




// Add User
function addLocalAdmin(event) {
    event.preventDefault();

    // Super basic validation - increase errorCount variable if any fields are blank
    var errorCount = 0;
    var errormsg = "";
    $('#addLocalAdmin input').each(function(index, val) {
        if($(this).val() === '') { errorCount++; errormsg+= "Missing value: "+ $('#addLocalAdmin input')[index].placeholder+"\n" }
    });
    if ( $('#addLocalAdmin input#inputAdminPassword').value !== $('#addLocalAdmin input#inputAdminPassword2').value ) {
        errorCount++;
	errormsg+= "Passwords do not match";
    };


    // Check and make sure errorCount's still at zero
    if(errorCount === 0) {

        // If it is, compile all user info into one object
        var newUser = {
            'newusername': $('#addLocalAdmin fieldset input#inputAdminUsername').val(),
            'fullname': $('#addLocalAdmin fieldset input#inputAdminFullname').val(),
            'school': $('#addLocalAdmin fieldset input#inputAdminSchool').val(),
            'email': $('#addLocalAdmin fieldset input#inputAdminEmail').val(),
            'phone': $('#addLocalAdmin fieldset input#inputAdminPhone').val(),
	    'password' : $('#addLocalAdmin fieldset input#inputAdminPassword').val(),
	    'role': 'local-admin'
        };

        // Use AJAX to post the object to our adduser service
        $.ajax({
            type: 'POST',
            data: newUser,
            url:  base_url+'/users/adduser/local-admin',
            dataType: 'JSON'
        }).done(function( response ) {

            // Check for successful (blank) response
            if (response.msg === '') {

                // Clear the form inputs
                $('#addLocalAdmin fieldset input').val('');

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
        alert(errormsg);
        return false;
    }
};




// Add User
function addTeacher(event) {
    event.preventDefault();

    // Super basic validation - increase errorCount variable if any fields are blank
    var errorCount = 0;
    var errormsg = "";

    $('#addTeacher input').each(function(index, val) {
        if($(this).val() === '') { errorCount++; errormsg+= "Missing value: "+ $('#addTeacher input')[index].placeholder+"\n" }
    });
    if ( $('#addTeacher input#inputTeacherPassword').value !== $('#addTeacher input#inputTeacherPassword2').value ) {
        errorCount++;
	errormsg+= "Passwords do not match";
    };

    // Check and make sure errorCount's still at zero
    if(errorCount === 0) {

        // If it is, compile all user info into one object
        var newUser = {
            'newusername': $('#addTeacher fieldset input#inputTeacherUsername').val(),
            'fullname': $('#addTeacher fieldset input#inputTeacherFullname').val(),
            'email': $('#addTeacher fieldset input#inputTeacherEmail').val(),
            'phone': $('#addTeacher fieldset input#inputTeacherPhone').val(),
            'school': $('#addTeacher fieldset input#inputTeacherSchool').val(),
 	    'password' : $('#addTeacher fieldset input#inputTeacherPassword').val(),
	    'role': 'teacher'       };

        // Use AJAX to post the object to our adduser service
        $.ajax({
            type: 'POST',
            data: newUser,
            url:  base_url+'/users/adduser/teacher',
            dataType: 'JSON'
        }).done(function( response ) {

            // Check for successful (blank) response
            if (response.msg === '') {

                // Clear the form inputs
                $('#addTeacher fieldset input').val('');

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
