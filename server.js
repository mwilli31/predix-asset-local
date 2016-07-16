var express     =   require("express");
var app         =   express();
var bodyParser  =   require("body-parser");
var mongoOp     =   require("./model/asset");
var bodyParser  =   require('body-parser');
var router      =   express.Router();
var request     =   require('request');
var cp		=   require('child_process');

////
var findUri = function(db, callback, uri) {
   var cursor =db.collection('asseturis').find({"uri":uri} );
   cursor.each(function(err, doc) {
      assert.equal(err, null);
      if (doc != null) {
         console.dir(doc);
      } else {
         callback();
      }
   });
};
////


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({"extended" : false}));

router.get("/",function(req,res){
    res.json({"error" : false,"message" : "Hello World Eli"});
});


router.route("/uri")
    .get(function(req,res){
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
     .post(function(req,res){
        var db = new mongoOp();
        var response = {};
        // fetch email and password from REST request.
        // Add strict validation when you use this in Production.

	 var responseExist = 0;
        //console.log(req.body);
        mongoOp.findOne({"uri":req.body.uri},function(err,data){
        // This will run Mongo Query to fetch data based on ID.
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
           
        
	//console.log("TEST " + responseExist);
	if(responseExist > 0){
		console.log("an asset with that uri is already in the db");
		res.json({"error": false, "message" : "no data was added"});
	}else{
      
	console.log("BEFORE " + req.body.kit);
	 db.uri = req.body.uri;
	db.edgeAlias = req.body.edgeAlias;
	db.kit = req.body.kit;
	db.manufacturer = req.body.manufacturer;
	db.oem = req.body.oem;
	db.sensor = req.body.sensor;
	db.category = req.body.category;
	db.protocol = req.body.protocol;
	 db.model = req.body.model;
	console.log("email sent : " + req.body.uri + " was added "  + req.body.oem + " herer");
//new//

	 var child = cp.fork('childTest');
                console.log("child");
            child.on('message',function(m){
                console.log("got "+ m);
        });
        console.log("SEND");
        child.send("https://asset-rest-service.run.aws-usw02-pr.ice.predix.io" + db.uri);


// var outString = "";
//  request.get(options).pipe(response);

//console.log("here TEST: " + JSON.stringify(request.get(options))); 
//
 
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


//added post
 .put(function(req,res){
        var response = {};
	var db = new mongoOp();
        // first find out record exists or not
        // if it does then update the record
	//console.log("foo");
        mongoOp.findOne({"uri":req.params.id},function(err,data){
            if(err) {
                response = {"error" : true,"message" : "Error fetching data"};
            } else {
		db = data;
		console.log("ppp : " + data);
            // we got data from Mongo.
            // change it accordingly.
		//console.log("HWERERRE : "  + req.params.id);
                if(req.body.uri !== undefined) {
                    // case where email needs to be updated.
		  //  console.log("bar : " + data.uri);
                    data.uri = req.body.uri;
		    //console.log("foobar :  " + data.uri);

                }
                if(req.body.model !== undefined) {
                    // case where password needs to be updated
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



router.route("/uriTest")
    .get(function(req,res){
        var response = {};
	console.log(req.query);
        mongoOp.findOne({"uri":req.query.uri},function(err,data){
        // This will run Mongo Query to fetch data based on ID.
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


///
router.route("/uriTest1")
    .get(function(req,res){
        var response = {};
	console.log(req.query);
        mongoOp.findOne({"uri":req.query.uri},function(err,data){
        // This will run Mongo Query to fetch data based on ID.
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
