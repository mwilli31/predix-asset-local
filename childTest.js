var express     =   require("express");
var app         =   express();
var bodyParser  =   require("body-parser");
var mongoOp     =   require("./model/asset");
var bodyParser  =   require('body-parser');
var router      =   express.Router();
var request     =   require('request');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({"extended" : false}));

//child processes the request
process.on('message', function(m,callback) {
  // Do work 
 var options = {
  url: m,
  headers: {
    'Authorization': 'YXBwLWNsaWVudC1pZDpzZWNyZXQ=',
    'Content-Type' : 'application/json'
  }
};
console.log("HERE child_process: " + m);
  // console.log(JSON.stringify(options, null, 2));

  request.get(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      //self.model = JSON.parse(response.body);
      //self.model  = JSON.stringify(self.modelA);
      console.log("[INFO] asset fetched " +body ); 
     console.log("[info] here " + JSON.parse(body)[0].uri);
      //post to local
      	var response = {};
		var db = new mongoOp();
        // first find out record exists or not
        // if it does then update the record
	//console.log("foo");
        mongoOp.findOne({"uri":JSON.parse(body)[0].uri},function(err,data){
            if(err) {
                response = {"error" : true,"message" : "Error fetching data"};
            } else {
		db = data;
		console.log("ppp : " + data);
            // we got data from Mongo.
            // change it accordingly.
		//console.log("HWERERRE : "  + req.params.id);
                if(JSON.parse(body)[0].uri !== undefined) {
                    // case where uri needs to be updated.
                    data.uri = data.uri +"-"+ data.id; 
			
                }
                if(JSON.parse(body)[0].model !== undefined) {
                    // case where model needs to be updated
                    data.model = JSON.parse(body)[0].model;
                }
		 if(JSON.parse(body)[0].protocol !== undefined) {
                    // case where model needs to be updated
                    data.protocol = JSON.parse(body)[0].protocol;
                }
		 if(JSON.parse(body)[0].category !== undefined) {
                    // case where model needs to be updated
                    data.category = JSON.parse(body)[0].category;
                }
		 if(JSON.parse(body)[0].sensor !== undefined) {
                    // case where model needs to be updated
                    data.sensor = JSON.parse(body)[0].sensor;
                }
		 if(JSON.parse(body)[0].model !== undefined) {
                    // case where model needs to be updated
                    data.oem = JSON.parse(body)[0].oem;
                }
		 if(JSON.parse(body)[0].manufacturer !== undefined) {
                    // case where model needs to be updated
                    data.manufacturer = JSON.parse(body)[0].manufacturer;
                }
		 if(JSON.parse(body)[0].kit !== undefined) {
                    // case where model needs to be updated
                    data.kit = JSON.parse(body)[0].kit;
                }
		 if(JSON.parse(body)[0]["edge-alias"] !== undefined) {
                    // case where model needs to be updated
                    //data["edge-alias"] = JSON.parse(body)[0]["edge-alias"];
                }

                // save the data
                data.save(function(err){
                    if(err) {
                        response = {"error" : true,"message" : "Error updating data"};
                    } else {
                        response = {"error" : false,"message" : "Data is updated for "+ JSON.parse(body)[0].uri};
                    }
                    //callback(200, response);
                })
            }
        });


    //callback(200, JSON.parse(response.body));
    } else if (error || response.statusCode != 200) {
      console.log("[INFO] Error fetching asset: " + response.statusCode);
    }
  });

  // Pass results back to parent process
  process.send('succsess??');
});


