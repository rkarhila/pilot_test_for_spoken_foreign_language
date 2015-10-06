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
            aTableContent += '<td><a href="#" class="linkshowuser" rel="' + this.username + '">' + this.username + '</a></td>';
            aTableContent += '<td>' + this.email + '</td>';
            aTableContent += '<td><a href="#" class="linkdeleteuser" rel="' + this._id + '">delete</a></td>';
            aTableContent += '</tr>';
        });

        // Inject the whole content string into our existing HTML table
        $('#adminList table tbody').html(aTableContent);

	
	// Username link click
	$('#adminList table tbody').on('click', 'td a.linkshowuser', showUserInfo);


	// Add User button click
	$('#btnAddUser').on('click', addUser);

	// Delete User link click
	$('#adminList table tbody').on('click', 'td a.linkdeleteuser', deleteUser);
	

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

    $.getJSON( '/users/userlist', function( data ) {

	// Stick our user data array into a userlist variable in the global object
	userListData = data;

        var tableContent="";
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
