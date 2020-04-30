#!/bin/bash
set -e
set -u
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cd ..
