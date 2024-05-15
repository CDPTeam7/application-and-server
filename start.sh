#!/bin/sh

sudo service nginx restart

sudo systemctl restart flask-project.service
sudo systemctl enable flask-project.service
sudo systemctl status flask-project.service
