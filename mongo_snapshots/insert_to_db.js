// Inserts items from JSON dumps make with the backup script 
// into the database called "nodetest2" because I never made
// the effort to rename it.
//
// Run this on the shell with 
//
//     node insert_to_db.js path_of_db_dumps
//
// Note: It does not exit properly yet and I'm in no way motivated
// to find out why.
//
// Hardly worth copywriting 2016-01-11 Reima Karhila 

var snapshotdir = process.argv.slice(2);

var fs = require('fs');

var monk = require('monk');
var db = monk('localhost:27017/nodetest2');
var queries = 0;

var collections = [
    {
	'collectionname': 'userlist',
	'idfields': ['username']
    },
    {
	'collectionname': 'tests',
	'idfields': ['version']
    },
    {
	'collectionname': 'tasks',
	'idfields': ['task_id']
    },
    {
	'collectionname': 'trials',
	'idfields': ['trial_id', 'task_id']
    },
    {
	'collectionname': 'feedback',
	'idfields': ['created']
    },   
];

function get_item_id(dbobject, idfields) {
    returnable="";
    idfields.forEach( function(field) {
	returnable +=  field +": "+dbobject[field] + ",";
    });

    return returnable;
}




collections.forEach( function(dbcollection) {
    
    snapshotfile=snapshotdir+"/"+snapshotdir+"."+dbcollection.collectionname+".json";
    console.log("Snapshotfile: "+snapshotfile);    

    var backupjson = JSON.parse(fs.readFileSync( snapshotdir+"/"+snapshotdir+"."+dbcollection.collectionname+".json" , 'utf8'));

    var collection = db.get(dbcollection.collectionname);

    var idfields = dbcollection.idfields;

    backupjson.forEach( function( dbobject ) {

	if (idfields.length==1) {
	    query={};
	    field=idfields[0];
	    query[field] = dbobject[field];
	}
	else {
	    query={};
	    idfields.forEach( function(field) {
		query[field] = dbobject[field]
	    });
	}
			
	console.log(dbcollection.collectionname + " query: ");
	console.log(query);

	queries++;
	collection.findOne( query , function(err, res) {

	    console.log(dbcollection.collectionname + " Item: "+ get_item_id(dbobject, dbcollection.idfields));

	    if (err) {
		console.log(dbcollection.collectionname + " err!");
		console.log(get_item_id(dbobject, dbcollection.idfields));
		return;
	    }
	    
	    if (!res) {
		console.log("Adding "+ get_item_id(dbobject, dbcollection.idfields));
		delete dbobject['_id'];
		collection.insert(dbobject, function(err, result){
		    if (err) {
			console.log("#######################################");
			console.log("#  M A J O R     P R O B L E M ! ! !  #");
			console.log("#######################################");
			console.log(" Could not add "+ get_item_id(dbobject, dbcollection.idfields));
			console.log(err);
		    }
		    else {	
			console.log("++++ Success!!  Added "+ get_item_id(dbobject, dbcollection.idfields));
                    };
                });

	    }
	    else {
		console.log("  "+get_item_id(dbobject, dbcollection.idfields)+ " already there");
	    }
	    console.log("Open queries: "+(queries--));
	} );
    } );
} );

console.log("=================");
console.log("That's all folks!");
