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



    $('#main').css('height', Math.max($( document ).height(), $(window).height()) +'px');

    populateTest(0);

    console.log("Binding controls");
    bindControls ();
    console.log("Bound controls!");

});

// Functions =============================================================




$(document).keypress(function(e){
    console.log("Key presssed: "+e.which);
    if (e.which == 110){
	populateTest();
    }
});



// A little helper used by the old scripts:
// getElementById
function $id(id) {
    return document.getElementById(id);
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

//window.onbeforeunload = function() {
//    startRecording.disabled = false;
//};

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
