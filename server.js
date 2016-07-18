var express     =   require("express");
var app         =   express();
var bodyParser  =   require("body-parser");
var mongoOp     =   require("./model/asset");
var bodyParser  =   require('body-parser');
var router      =   express.Router();
var request     =   require('request');
var cp		=   require('child_process');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({"extended" : false}));

//most basic call
router.get("/",function(req,res){
    res.json({"error" : false,"message" : "Hello World"});
});


router.route("/uri")
    .get(function(req,res){ //gets all the assets in the local db
        var response = {};
        mongoOp.find({},function(err,data){
        // Mongo command to fetch all data from collection.
            if(err) {
                response = {"error" : true,"message" : "Error fetching data"};
            } else {
                response = {"error" : false,"message" : data};
            }
            
             res.json(response);
        });
    })
//post to local asset and fire off workflow
     .post(function(req,res){
        var db = new mongoOp();
        var response = {};
	 var responseExist = 0;
	//check to make sure that new asset is unique by using edge-alias
        mongoOp.findOne({"edge-alias":req.body["edge-alias"]},function(err,data){
        // This will run Mongo Query to fetch data based on edge-alias.
            if(err) {
                responseExist = -1;
            } else {
                if(data != null){
                        responseExist = 1;
			//console.log("true? " + responseExist);
                }else{
                        responseExist = 0;
			//console.log("false? " + responseExist);
                }
            }
           
        
	if(responseExist > 0){
		console.log("an asset with that uri is already in the db");
		res.json({"error": false, "message" : "no data was added"});
	}else{
      //asset alias is unique
	console.log("body " + req.body.kit);
	 db.uri = req.body.uri;
	db["edge-alias"] = req.body["edge-alias"];
	db.kits = req.body.kits;
	db.manufacturers = req.body.manufacturers;
	db.oems = req.body.oems;
	db.sensors = req.body.sensors;
	db.category = req.body.category;
	db.protocols = req.body.protocols;
	 db.model = req.body.model;
        db.devices = req.body.devices;
	console.log("email sent : " + req.body.uri + " was added "  + req.body.oem + " herer");
//new child process for assetMicroservice//

	 var child = cp.fork('/predix/predix-asset-local/assetMicroservice');
                console.log("child");
            child.on('message',function(m){
                console.log("got "+ m);
        });
        console.log("SEND");
	child.send("https://asset-rest-service.run.aws-usw02-pr.ice.predix.io/demo" + req.body.uri +"^"+ req.body.devices+"&"+req.body.kits);
	
        db.save(function(err){
        // save() will run insert() command of MongoDB.
        // it will add new data in collection.
            if(err) {
                response = {"error" : true,"message" : "Error adding data"};
            } else {
                response = {"error" : false,"message" : "Data added"};
            }
            res.json(response);
	
        });

	}
	});
    });

// other rest calls
// gets asset by mongo id
router.route("/uri/:id")
    .get(function(req,res){
        var response = {};
        mongoOp.findById(req.params.id,function(err,data){
        // This will run Mongo Query to fetch data based on ID.
            if(err) {
                response = {"error" : true,"message" : "Error fetching data"};
            } else {
                response = {"error" : false,"message" : data};
            }
            res.json(response);
        });
    })
//deletes based on uri (depricated)
    .delete(function(req,res){
        var response = {};
        // find the data
        mongoOp.findOne(req.params.id,function(err,data){
            if(err) {
                response = {"error" : true,"message" : "Error fetching data"};
            } else {
                // data exists, remove it.
                mongoOp.remove({uri : req.params.id},function(err){
                    if(err) {
                        response = {"error" : true,"message" : "Error deleting data"};
                    } else {
                        response = {"error" : true,"message" : "Data associated with "+req.params.id+"is deleted"};
                    }
                    res.json(response);
                });
            }
        });

})


//put to update asset based on uri
 .put(function(req,res){
        var response = {};
	var db = new mongoOp();
        mongoOp.findOne({"uri":req.params.id},function(err,data){
            if(err) {
                response = {"error" : true,"message" : "Error fetching data"};
            } else {
		db = data;
		console.log("data found : " + data);
            // we got data from Mongo.
            // change it accordingly
                if(req.body.uri !== undefined) {
                    data.uri = req.body.uri;

                }
                if(req.body.model !== undefined) {
                    // case where model needs to be updated
                    data.model = req.body.model;
                }
                // save the data
                data.save(function(err){
                    if(err) {
                        response = {"error" : true,"message" : "Error updating data"};
                    } else {
                        response = {"error" : false,"message" : "Data is updated for "+req.params.id};
                    }
                    res.json(response);
                })
            }
        });
    })


//modified to work with edgealias so it can include backslashes
router.route("/uriTest")
    .get(function(req,res){
        var response = {};
	console.log(req.query);
       // mongoOp.findOne({"uri":req.query.uri},function(err,data){
        mongoOp.findOne({"edge-alias":req.query.uri},function(err,data){

	// This will run Mongo Query to fetch data based on URI.
            if(err) {
                response = {"error" : true,"message" : "Error fetching data"};
            } else {
		if(data != null){
                	response = {"error" : false,"message" : true};
		}else{
			response = {"error" : false,"message" : false};
		}
            }
            res.json(response);
        });
    })


///added delete by uri (USE THIS DELETE)
router.route("/uriTest1")
    .get(function(req,res){
        var response = {};
	console.log(req.query);
        mongoOp.findOne({"uri":req.query.uri},function(err,data){
        // This will run Mongo Query to fetch data based on URI.
            if(err) {
                response = {"error" : true,"message" : "Error fetching data"};
            } else {
		mongoOp.remove({"uri":req.query.uri},function(err,data){
			 if(err) {
                        response = {"error" : true,"message" : "Error deleting data"};
                    } else {
                        response = {"error" : true,"message" : "Data associated with "+req.params.id+"is deleted"};
                    }
                    res.json(response);
                });
            }
          
        });
    })
app.use('/',router);

app.listen(3000);
console.log("Listening to PORT 3000");
