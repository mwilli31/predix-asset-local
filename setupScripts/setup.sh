#!/bin/bash
echo "setting up system"
​
cd /
mkdir data
cd data
mkdir db
​
cd /predix
cd predix-asset-local
​
apt-get install sudo
apt-get -y install mongodb
sudo apt-get -y install nodejs-legacy
apt-get -y install npm
npm install
​
cd setupScripts/
./mongoSetup.sh
./startMongo.sh
​
echo "done"
​
