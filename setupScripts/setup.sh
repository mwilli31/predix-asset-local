echo "setting up system"



cd /
mkdir data
cd data
mkdir db

cd 
cd localAsset

apt-get install sudo
apt-get install mongodb
sudo apt-get install nodejs-legacy
npm install

cd setupScripts/
./mongoSetup.sh
./startMongo.sh



echo "done"

