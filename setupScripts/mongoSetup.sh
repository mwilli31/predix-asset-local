#!/bin/bash
echo "Creating Mongo service"
​
cd ..
runPath="$PWD"
​
​
echo '[Unit]' > /etc/systemd/system/mongoStart.service
echo 'Description=Start Mongo in the background' >> /etc/systemd/system/mongoStart.service
echo 'After=network.target' >> /etc/systemd/system/mongoStart.service
echo '' >> /etc/systemd/system/mongoStart.service
echo '[Service]' >> /etc/systemd/system/mongoStart.service
echo 'ExecStartPre=/usr/bin/mongod --repair' >> /etc/systemd/system/mongoStart.service
echo 'ExecStart=/usr/bin/mongod' >> /etc/systemd/system/mongoStart.service
echo 'Restart=always' >> /etc/systemd/system/mongoStart.service
echo 'RestartSec=10' >> /etc/systemd/system/mongoStart.service
echo '' >> /etc/systemd/system/mongoStart.service
echo '[Install]' >> /etc/systemd/system/mongoStart.service
echo 'WantedBy=multi-user.target' >> /etc/systemd/system/mongoStart.service
​
#echo "Enabling new service"
#sudo systemctl daemon-reload
#sudo systemctl start mongoStart
​
#sudo systemctl enable mongoStart
​
echo "done"
