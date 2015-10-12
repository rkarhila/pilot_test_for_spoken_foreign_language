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
    $.getJSON( '/users/userlist/admins', function( adminData ) {

	// Stick our user data array into a userlist variable in the global object
	adminListData = adminData;

        var aTableContent = "";
        // For each item in our JSON, add a table row and cells to the content string
        $.each(adminData, function(){
            aTableContent += '<tr>';
            aTableContent += '<td><a href="#" class="linkshowuser" rel="' + this.username + '">' + this.fullname + '</a></td>';
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
	$('#btnAddLocalAdmin').on('click', addLocalAdmin);

	// Delete User link click
	//$('#adminList table tbody').on('click', 'td a.linkdeleteuser', deleteUser);


    });

    $.getJSON( '/users/userlist/teachers', function( teacherData ) {

	// Stick our user data array into a userlist variable in the global object
	teacherListData = teacherData;

        var tTableContent="";

        // For each item in our JSON, add a table row and cells to the content string
        $.each(teacherData, function(){
            tTableContent += '<tr>';
            tTableContent += '<td><a href="#" class="linkshowuser" rel="' + this.username + '">' + this.username + '</a></td>';
            tTableContent += '<td>' + this.email + '</td>';
            tTableContent += '<td><a href="#" class="linkdeleteuser" rel="' + this._id + '">delete</a></td>';
            tTableContent += '</tr>';
        });

        // Inject the whole content string into our existing HTML table
        $('#teacherList table tbody').html(tTableContent);


	// Username link click
	$('#teacherList table tbody').on('click', 'td a.linkshowuser', showUserInfo);


	// Add User button click
	$('#btnAddUser').on('click', addUser);

	// Delete User link click
	$('#teacherList table tbody').on('click', 'td a.linkdeleteuser', deleteUser);

    });

    $.getJSON( '/users/userlist/users', function( data ) {

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
            tableContent += '<td>' + this.testcount + '</td>';
            tableContent += '<td>' + this.phoneticscore + '</td>';
            tableContent += '<td>' + this.fluencyscore + '</td>';
            tableContent += '<td><a href="#" class="linkdeleteuser" rel="' + this._id + '">delete</a></td>';
            tableContent += '</tr>';
        });

        // Inject the whole content string into our existing HTML table
        $('#userList table tbody').html(tableContent);


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
    $('#userInfoPhoneticScore').html(getDropMenu("phonetic", thisUserObject.fluencyscore));
    $('#userInfoFluencyScore').html(getDropMenu("fluency", thisUserObject.phoneticscore));

    thisUserObject.tasks.forEach(function( task ) {
	$('#userInfoTasks').append("<br><strong>Task "+thisUserObject.tasks[task]+":</strong><br> ");
	if (typeof(thisUserObject.trials[task]) !== 'undefined') {
	    thisUserObject.trials[task].forEach(function( trial ) {
		if (thisUserObject.testsdone[task][trial]) {
		    $('#userInfoTasks').append('<video src=/answers/video/'+thisUserObject.testsdone[task][trial]+' controls>');
		}
		else {
		    $('#userInfoTasks').append("("+trial+")");
		}
	    });
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
            'username': $('#addUser fieldset input#inputStudentsTeacher').val(),
            'location': $('#addUser fieldset input#inputUserLocation').val(),
            'class': $('#addUser fieldset input#inputUserClass').val(),
            'langgroup': $('#addUser fieldset input#inputUserLangGroup').val()
        };

        // Use AJAX to post the object to our adduser service
        $.ajax({
            type: 'POST',
            data: newUser,
            url: '/users/adduser/user',
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
            'newusername': $('#addUser fieldset input#inputAdminUsername').val(),
            'fullname': $('#addUser fieldset input#inputAdminFullName').val(),
            'school': $('#addUser fieldset input#inputAdminSchool').val(),
            'email': $('#addUser fieldset input#inputAdminEmail').val(),
            'phone': $('#addUser fieldset input#inputAdminPhone').val(),
	    'password' : $('#addUser fieldset input#inputAdminPassword').val(),
	    'role': 'local-admin'
        };

        // Use AJAX to post the object to our adduser service
        $.ajax({
            type: 'POST',
            data: newUser,
            url: '/users/adduser/local-admin',
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
        alert(errormsg);
        return false;
    }
};




// Add User
function addTeacher(event) {
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
            'username': $('#addUser fieldset input#inputStudentsTeacher').val(),
            'location': $('#addUser fieldset input#inputUserLocation').val(),
            'class': $('#addUser fieldset input#inputUserClass').val(),
            'langgroup': $('#addUser fieldset input#inputUserLangGroup').val()
        };

        // Use AJAX to post the object to our adduser service
        $.ajax({
            type: 'POST',
            data: newUser,
            url: '/users/adduser/teacher',
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
