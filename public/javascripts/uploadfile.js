
/*(function() {
*/
    // getElementById
    function $id(id) {
	return document.getElementById(id);
    }

/*
    // output information
    function Output(msg) {
    var m = $id("messages");
    m.innerHTML = msg + m.innerHTML;
    }
*/
function UploadFile(file, filename, uploadurl) {

    console.log("Going into Uploadfile with filename "+filename);
    var xhr = new XMLHttpRequest();

    //console.log("file size: "+file.size);

    // File size check disabled for now!
    //if (file.size <= $id("MAX_FILE_SIZE").value) {
	if (xhr.upload) {
	    // create progress bar
	    var o = $id("progress");
	    //var m = $id("messages");
	    //var progress = o.appendChild(document.createElement("p"));
	    var progress = o.insertBefore(document.createElement("p"), o.firstChild);
	    var date = new Date();
	    var n = date.toDateString();
	    var time = date.toLocaleTimeString();
	    progress.appendChild(document.createTextNode( messagelist[lang].uploading + filename));
	    //progress.insertBefore(document.createTextNode(time +" upload " + file.name), progress.firstChild)
	    //m.insertBefore(document.createTextNode( time +" upload " + file.name + "\n"), m.firstChild);

	    // progress bar
	    xhr.upload.addEventListener("progress", function(e) {
		var pc = parseInt(100 - (e.loaded / e.total * 100));
		progress.style.backgroundPosition = pc + "% 0";
	    }, false);

	    // file received/failed
	    xhr.onreadystatechange = function(e) {
		if (xhr.readyState == 4) {
		    //progress.className = (xhr.status == 200 ? "success" : "failure");
		    var err=0;
		    if (xhr.status != 200) {
			progress.className = "failure";
			progress.innerHTML="Error! Server response: "+xhr.status;
			err=1;
		    }
		    else {
			var resp = JSON.parse(xhr.responseText);
			progress.innerHTML=resp['msg'];
			console.log("Server response for "+filename+": "+resp['msg']);
			progress.className = (resp['errorcode'] == "0" ? "success" : "failure");
			err = (resp['errorcode'] == "0" ? 0 : 1);
		    }
		    if (err) {
			Recorder.setupDownload(file, filename);
		    }
		}
	    };

	    // start upload
	    console.log("Opening xhr for "+filename);	    
	    xhr.open("POST", uploadurl, true);
	    xhr.setRequestHeader("X-FILENAME", filename);
	    xhr.setRequestHeader("HTTP-X-FILENAME", filename);
	    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
	    xhr.send(file);
	    console.log("Send command made for "+filename);	    
	}
	else {
	    console.log("Error initialising xhr for "+filename);
	}
    //} else {
    //	console.log("File "+filename+" too large (" + file.size + ")");
    //}
}
