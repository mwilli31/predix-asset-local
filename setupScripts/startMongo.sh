#!/bin/bash
echo "Creating Mongo service"
​
cd ..
runPath="$PWD"
​
echo '[Unit]' > /etc/systemd/system/mongoServer.service
echo 'Description=Start Mongo in the background' >> /etc/systemd/system/mongoServer.service
echo 'After=network.target mongoStart.service' >> /etc/systemd/system/mongoServer.service
echo '' >> /etc/systemd/system/mongoServer.service
echo '[Service]' >> /etc/systemd/system/mongoServer.service
echo 'ExecStart=/usr/bin/node /root/localAsset/server.js' >> /etc/systemd/system/mongoServer.service
echo 'Restart=always' >> /etc/systemd/system/mongoServer.service
echo 'RestartSec=10' >> /etc/systemd/system/mongoServer.service
echo '' >> /etc/systemd/system/mongoServer.service
echo '[Install]' >> /etc/systemd/system/mongoServer.service
echo 'WantedBy=multi-user.target' >> /etc/systemd/system/mongoServer.service
​
echo "Enabling new service"
#sudo systemctl daemon-reload
#sudo systemctl start mongoServer
​
#sudo systemctl enable mongoServer
​
echo "done"
