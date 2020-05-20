#!/bin/bash
set -e
set -u
cd backend
source venv/bin/activate
flask run
cd ..
 
