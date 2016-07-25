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
var partOne = m.substr(0,m.indexOf('^'));
var partTwoTemp = m.substr(m.indexOf('^')+1);
var partTwo = partTwoTemp.substr(0,partTwoTemp.indexOf('&'));
var partThree = partTwoTemp.substr(partTwoTemp.indexOf('&')+1);
console.log("child was started " + partOne + " try: " + partTwo  + " hopw : " + partThree)
var nameLength = partOne.length;
var n = partOne.substring(nameLength-2); 
//m =  m.substring(0,nameLength-2);
 var options = {
 method: 'POST',
  url: partOne,
  headers: {
    'Authorization': 'YXBwLWNsaWVudC1pZDpzZWNyZXQ=',
    'Content-Type' : 'application/json'
  },
  body: { devices: partTwo , kits: partThree },
  json: true };


console.log("HERE child_process: " + m);
  // console.log(JSON.stringify(options, null, 2));

  request(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      //self.model = JSON.parse(response.body);
      //self.model  = JSON.stringify(self.modelA);
      console.log("[INFO] asset fetched " + body[0].uri ); 
     console.log("[info] here " + body[0].uri);
      //post to local
      	var response = {};
		var db = new mongoOp();
        // first find out record exists or not
        // if it does then update the record
	console.log("foo " + body[0].sensors +n);
        mongoOp.findOne({"uri":body[0].sensors+n},function(err,data){
            if(err) {
                response = {"error" : true,"message" : "Error fetching data"};
            } else {
		db = data;
		console.log("ppp : " + data);
            // we got data from Mongo.
            // change it accordingly.
		//console.log("HWERERRE : "  + req.params.id);
                if(body[0].uri !== undefined) {
                    // case where uri needs to be updated.
                    var temp = body[0].uri.substr(body[0].uri.indexOf('G')); 
			db.uri = "/tags/"+temp;
                }
                if(body[0].model !== undefined) {
                    // case where model needs to be updated
                    data.model = body[0].model;
                }
		 if(body[0].protocols !== undefined) {
                    // case where model needs to be updated
                    data.protocols = body[0].protocols;
                }
		 if(body[0].category !== undefined) {
                    // case where model needs to be updated
                    data.category = body[0].category;
                }
		 if(body[0].sensors !== undefined) {
                    // case where model needs to be updated
                    data.sensors = body[0].sensors;
                }
		 if(body[0].oems !== undefined) {
                    // case where model needs to be updated
                    data.oems = body[0].oems;
                }
		 if(body[0].manufacturers !== undefined) {
                    // case where model needs to be updated
                    data.manufacturers = body[0].manufacturers;
                }
		 if(body[0].kits !== undefined) {
                    // case where model needs to be updated
                    //data.kits = body[0].kits;
                }
		 //if(JSON.parse(body)[0]["edge-alias"] !== undefined) {
                    // case where model needs to be updated
		//	 var temp = JSON.parse(body)[0].uri.substr(JSON.parse(body)[0].uri.indexOf('G'));
                 //  	 var temp2 =temp.substr(0,temp.indexOf('*'));
 		//	 db["edge-alias"] = temp2+n;
                    // db.devices = db.devices;
		    // db.kits = "/kits/intel_edison_grove_flower";
		     	
               // }

                // save the data
                data.save(function(err){
                    if(err) {
                        response = {"error" : true,"message" : "Error updating data"};
                    } else {
                        response = {"error" : false,"message" : "Data is updated for "+ body[0].uri};
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


