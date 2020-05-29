#!/bin/bash
export REACT_APP_API_URL=https://krasnodar-road-network.ru
cd ./frontend
rm -r ./build
npm run build
cd ..
