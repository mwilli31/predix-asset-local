This is a simple REST API using Node.js and MongoDB

Naviagate to /setupScripts and run

	./setup.sh
 or

---ALTERNATE INSTALL----

In order to get started the first step is to download and install MongoDB

If this is the first time sertting up the DB, in terminal run the following command to start the MongoDB server at the default port and link it to this directory:

	mongod --dbpath ~/localAsset

If you have already set the path in a previous session, then inorder to start the server, navigate to this directory and simply type:

	mongod

If for some reason the last session ended in an error the above command will not work, instead try using:

	mongod --repair

You should see a response like "Wed Jun 29 20:37:55.241 [initandlisten] waiting for connections on port 27017


to test that MongoDB is working, open a new terminal window and type:

	mongo

The database should start, to exit hit contol C

At this point you should be able to type:

	npm start

And the local server should start and you can start making API calls using a service like Postman

Here are the supported calls:

POST localhost:3000/uri
	header = Content-Type == application/json
	then include the json object in the body.

GET localhost:3000/uri
	will return all assets in the DB

DELETE localhost:3000/uri/:id
	deletes the asset with the specified uri

GET localhost:3000/uri/:id
	gets the asset with the specified mongo id

GET localhost:3000/uriTest?uri=:uri
	where uri is the uri of the asset you are looking for, will return true if it is in the db and false if it is not.

PUT localhost:3000/uri/:id
	":id" is the URI of the asset that you wish to modify. In the body pass in the json object with one or both of the attributes
	(uri or model). This command will update or add new information to the specified asset

Note: since this DB is meant to be run on an edge device, if the REST calls are being called from another device the uri "localhost"
will not work, instead use the ip address of the edge device. (For example GET 10.10.10.148:/300/uri)

If when you run the mongod command above, and the response exits by an unclean shutdown run this command to see the mongod process:

	ps ax | grep mongod

you might see a line that looks like this:

	437 ttyMFD2 S+   0:00 grep mongod

kill this preocess by typing:

	kill -9 0000

where 0000 is the process id.
--------------------------------------------------------------
NEW:
when calling the POST localhost:3000/uri API call, there is additional functionality that this call does. (FT will post in this format)
When calling post with a body that looks like this:

	{
		"uri" : "/sensors/Grove_Sensor_1_1-1",
		"devices" : "/devices/FTdeviceID",
		"kits": "/kits/kitType",
		"edge-alias" : "Grove_Sensor_1_1-1"
	}

(Note: this call will be made from flowthings, so the post call will be generated from the flowthings track )

The post will first make sure that the edge-alias is unique to the Local DB,
Then if it is, it will create a child process that is implemeted in childTestDEMO.js, and will post the simple sensor info to the Local DB.
This child Process makes an API call to the asset-rest-service microservice in Predix.
This API call first fetches more data about that specific type of sensor from an Asset Registry, then creates a new URI for the Sensor,
by assigning it in this form "/tags/Grove_Sensor*UUID". To verify that the UUID is globally unique their is an automatic API POST to
the global Timeseries for the Kits. If it is a unique tag, then the microservice will update the original post to the Local DB, with the new info and UUID tag.

Still to be implemented is, at the same time, the same tag will be posted to a global asset registry so data from timeseries can be visualized later

--------------------------------------------------------------
If there are any questions or issues you can email eli.goldweber@ge.com for clarification.