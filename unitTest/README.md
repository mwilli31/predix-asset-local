This directory contains unit testing scripts for the api on this repo.

It is based off the same fundamental architecture of the REST Api and uses mocha to run the tests

after starting the REST client server, navigate to this directory and run the command:

	mocha

this should run throught the tests defined in test.js

it tests:
the test GET call, then the GET call that returns all of the assets in the db.
mocha then posts a test asset to the db, and GETS it using the specific uri. 
It then cleans up and DELETES the new asset.

it should pass all of the tests.
