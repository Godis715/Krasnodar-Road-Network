#!/bin/bash
cd backend
rm -r ./venv
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cd ..
