#!/bin/bash
set -e
set -u
export REACT_APP_API_URL=localhost:5000
cd frontend
npm start
cd .. 
