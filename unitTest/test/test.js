var supertest = require("supertest");
var should = require("should");
var assert = require("assert");
var server = supertest.agent("10.10.10.148:3000");
var uriServer = supertest.agent("10.10.10.148:3000/uriTest?uri=UnitTest4");
describe("SAMPLE Unit Tests ",function(){

	it("should return GET Sample call",function(done){
	server
	.get("/")	
	.expect("Content-type",/json/)
	.expect(200)
	.end(function(err,res){
	   res.status.should.equal(200);
	   res.body.error.should.equal(false);
	 done();
	});

	});
	it("should return GET of all assets",function(done){
        server
    	.get("/uri")
        .expect("Content-type",/json/)
        .expect(200)
        .end(function(err,res){
          res.status.should.equal(200);
           res.body.error.should.equal(false);
         done();
        });

    });
 it("simle POST of an asset",function(done){
        server
	.post("/uri")
	.send({uri:"UnitTest4"})
        .expect("Content-type",/json/)
        .expect(200)
        .end(function(err,res){
		if(err) return done(err);
	
	if(res.body.message == ("no data was added")){ 
	console.log("ok, but no data added");
	return done();
}
          res.status.should.equal(200);
           res.body.error.should.equal(false);
	   res.body.message.should.equal("Data added")
         done();

        });

    });
  it("getURI t/F",function(done){
        uriServer
	.get("")
        .expect("Content-type",/json/)
        .expect(200)
        .end(function(err,res){
          res.status.should.equal(200);
           res.body.error.should.equal(false);
	  res.body.message.should.equal(true);
	
         done();
        });

    });

it("should DELETE newly added asset",function(done){
        server
	.delete("/uri/UnitTest4")
        .expect("Content-type",/json/)
        .expect(200)
        .end(function(err,res){
          res.status.should.equal(200);
          res.body.error.should.equal(false);
         done();
        });

    });

	
}); 
